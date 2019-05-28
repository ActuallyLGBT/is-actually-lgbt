import * as express from 'express'
import * as session from 'express-session'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import * as Passport from 'passport'
import * as Promise from 'bluebird'
import * as R from 'ramda'
import * as path from 'path'
import * as routes from './routes'
import nextapp from './nextapp'
import { ApolloServer, gql } from 'apollo-server-express'
import * as controllers from './controllers'
import * as middleware from './middleware'
import { Services } from './services'
import { DbManager } from './db'
import { IServer, IDbManager, Initializable } from './lib'
import * as config from '../server.config'

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

interface ValidNameData {
  available: Boolean
  slug: String
}

interface PronounData {
  objective: String[]
  subjective: String[]
}

interface LinkType {
  name: String
  icon: String
  attribute: String
  template: String
}

const typeDefs = gql`
  input UserData {
    userId: String!
  }

  input PageInput {
    name: String
    email: String
    letters: [String]
    socialLinks: [LinkData]
    pronounSub: String
    pronounObj: String
  }

  input LinkData {
    linkTypeId: String!
    value: String!
  }

  type PageData {
    pageId: String
    name: String
    email: String
    letters: [String]
    socialLinks: [Link]
    pronounSub: String
    pronounObj: String
  }

  type ValidNameData {
    available: Boolean!
    slug: String!
  }

  type Link {
    linkTypeId: String!
    value: String!
  }

  type PronounData {
    objective: [String]!
    subjective: [String]!
  }

  type LinkType {
    typeId: String!
    name: String!
    icon: String!
    attribute: String!
    template: String!
  }

  type Query {
    validateName(name: String!): ValidNameData
    getPronounList: PronounData
    getLinkTypes: [LinkType]
  }

  type Mutation {
    createPage(user: UserData!, page: PageInput!): PageData
  }
`

const resolvers = {
  Mutation: {
    createPage(_, args) {
      return { pageId: '123abc', ...args.page }
    }
  },
  Query: {
    validateName(_, args): Promise<ValidNameData> {
      return server.db.get('Page').findOne({pageId: args.name})
      .then(dbItem => {
        return {
          available: dbItem ? false : true,
          slug: args.name
        }
      })
    },
    getPronounList(): PronounData {
      return server.db.get('Pronoun').find()
        .then(ret => {
          if (!ret.length) {
            return {
              objective: [],
              subjective: []
            }
          }
          let items = R.groupBy(R.prop('pronounType'), ret)

          if (!items['objective']) {
            items['objective'] = []
          }

          if (!items['subjective']) {
            items['subjective'] = []
          }

          return items
        }).then(ret => {
          for (const key in ret) {
            ret[key] = R.pluck('text', ret[key])
          }
          return ret
        })
    },
    getLinkTypes(): LinkType[] {
      return server.db.get('LinkType').find()
        .then(ret => { return !ret.length ? [] : ret })
        .then(R.project([
            'typeId',
            'name',
            'icon',
            'attribute',
            'template'
          ])
        )
    }
  }
}

class Server implements IServer {

  private _config: any
  private _db: DbManager
  private _services: Services

  constructor () {
    let options = {
      mongo: {
        uri: 'mongodb://localhost/is_actually'
      }
    }

    this._config = config

    this._db = new DbManager(options)

    this._services = new Services(this)

  }

  public get db (): IDbManager {
    return this._db
  }

  public get services (): Services {
    return this._services
  }

  public get config (): any {
    return this._config
  }

  /**
   * Runs the server
   * @returns {Promise}
   */
  public run (): Promise<any> {
    const self = this
    return self.db.run()
    .then(_ => {
      const gqlServer = new ApolloServer({ typeDefs, resolvers })

      const app = express()

      gqlServer.applyMiddleware({ app })

      app.set('views', path.join(__dirname, 'views'))
      app.set('view engine', 'ejs')
      app.set('verbose errors', true)

      app.use(compression())
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(cookieParser())
      app.use(middleware.authorization(self))
      app.use(session({ secret: self.config.session.secret }))
      app.use(Passport.initialize())

      for (const key in controllers) {
        const ctrl: Initializable = new controllers[key](self)
        ctrl.init(app)
      }

      app.use('/', routes.app)

      return nextapp.prepare()
      .then(_ => {
        app.listen(port)
        console.log(`🚀 Server ready at http://localhost:${port}${gqlServer.graphqlPath}`)
      })
    })
  }
}

const server = new Server()

server.run().catch(err => {
  console.error(err)
})
