import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as Passport from 'passport'
import * as Promise from 'bluebird';
import * as R from 'ramda';
import * as routes from './routes';
import nextapp from './nextapp';
import { ApolloServer, gql } from 'apollo-server-express';
import * as Controllers from './controllers'
import Services from './services'
import DbManager from './db'
import { IServer, IController, IDbManager } from './lib'
import { TypedCollection } from './utils'

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

interface ValidNameData {
  available: Boolean;
  slug: String;
}

interface PronounData {
  objective: String[];
  subjective: String[];
}

interface LinkType {
  name: String;
  icon: String;
  attribute: String;
  template: String;
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
`;

const resolvers = {
  Mutation: {
    createPage(_, args) {
      return { pageId: '123abc', ...args.page };
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
};

class Server implements IServer {

  // _api: ApiManager
  _db: DbManager
  _ctrls: TypedCollection<string, IController>
  _services: Services
  _config: any

  constructor () {
    let options = {
      mongo: {
        uri: 'mongodb://localhost/is_actually'
      }
    }

    this._config = {
      baseUrl: 'http://localhost:3000',
      passport: {
        strategies: {
          // google: {
          //   name: 'Google',
          //   protocol: 'oauth2',
          //   strategy: require('passport-google-oauth2').Strategy,
          //   scope: ['email'],
          //   options: {
          //     clientID: '',
          //     clientSecret: ''
          //   }
          // }
        }
      }
    }

    this._db = new DbManager(this, options)

    this._ctrls = new TypedCollection<string, IController>()

    this._services = new Services(this)

    for (const key in Controllers) {
      const ctrl: IController = new Controllers[key](this)
      this._ctrls.set(key, ctrl)
    }

  }

  get db (): IDbManager {
    return this._db
  }

  get controllers (): IController[] {
    return this._ctrls.toArray()
  }

  get services (): Services {
    return this._services
  }

  get config (): any {
    return this._config
  }

  /**
   * Runs the server
   * @returns {Promise}
   */
  run (): Promise<any> {
    const self = this
    return this.db.run()
      .then(() => {
        const gqlServer = new ApolloServer({ typeDefs, resolvers });

        const app = express();
        gqlServer.applyMiddleware({ app });

        app.use(compression());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(Passport.initialize());
        app.use(Passport.session());

        for (const ctrl of self.controllers) {
          ctrl.registerRoutes(app)
        }

        app.use('/api', routes.api);
        app.use('/', routes.app);

        return nextapp.prepare()
          .then(() => {
            app.listen(port);
            console.log(`🚀 Server ready at http://localhost:${port}${gqlServer.graphqlPath}`);
          })
      })
  }
}

const server = new Server()

server.run().catch(err => {
  console.error(err)
})
