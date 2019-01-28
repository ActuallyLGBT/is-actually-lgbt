import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
// import * as path from 'path'
import * as Promise from 'bluebird';
import * as R from 'ramda';
import * as routes from './routes';
import nextapp from './nextapp';
import { ApolloServer, gql } from 'apollo-server-express';
import { ApiManager, PageApiSpec } from './api'
import DbManager from './db'
import { IServer, IApiManager, IDbManager } from './lib'

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
      return server.api.get<PageApiSpec>().validateName(args.name)
        .then(ret => { return { available: ret, slug: args.name } })
    },
    getPronounList(): PronounData {
      return server.api.getPronounList()
        .then(ret => {
          for (const key in ret) {
            ret[key] = R.pluck('text', ret[key])
          }
          return ret
        })
    },
    getLinkTypes(): LinkType[] {
      return server.api.getLinkTypes()
        .then(R.project([
            'typeId',
            'name',
            'icon',
            'attribute',
            'template'
          ]))
    }
  }
};

class Server implements IServer {

  _api: ApiManager
  _db: DbManager

  constructor () {
    let options = {
      mongo: {
        uri: 'mongodb://localhost/is_actually'
      }
    }

    this._api = new ApiManager(this)
    this._db = new DbManager(this)

  }

  get api (): IApiManager {
    return this._api
  }

  get db (): IDbManager {
    return this._db
  }

  /**
   * Runs the server
   * @returns {Promise}
   */
  async run () {
    return Promise.each(this.plugins.toArray(), plugin => {
      if (typeof plugin.run === 'function') {
        return plugin.run()
      }
    }).then(() => {
      const gqlServer = new ApolloServer({ typeDefs, resolvers });

      const app = express();
      gqlServer.applyMiddleware({ app });

      app.use(compression());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(cookieParser());

      app.use('/api', routes.api);
      app.use('/', routes.app);

      (async () => {
        try {
          await nextapp.prepare();
          app.listen(port);
          console.log(`🚀 Server ready at http://localhost:${port}${gqlServer.graphqlPath}`);
        } catch (err) {
          console.error(err.message);
        }
      })();
    })
  }
}

const server = new Server()
server.run()
