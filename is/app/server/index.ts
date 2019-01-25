import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as path from 'path'
import * as Promise from 'bluebird';
import * as R from 'ramda';
import * as routes from './routes';
import nextapp from './nextapp';
import { ApolloServer, gql } from 'apollo-server-express';
import { Collection } from './utils'
import { APIPlugin, MongoosePlugin } from './plugins'

const resolve = (str) => path.join('server', str)

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
    validateName(_, args): ValidNameData {
      return server.api.validateName(args)
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

let EventEmitter;
try {
    EventEmitter = require("eventemitter3");
} catch(err) {
    EventEmitter = require("events").EventEmitter;
}

class Server extends EventEmitter{

  plugins: Collection

  constructor () {
    super()

    let options = {
      mongo: {
        uri: 'mongodb://localhost/is_actually'
      }
    }

    this.plugins = new Collection()

    this
      .createPlugin('api', APIPlugin, options)
      .createPlugin('db', MongoosePlugin, options)

    this
      .register('api', resolve('api'))
      .register('db', resolve('schemas'))

  }

  get api (): any {
    return this.plugins.get('api')
  }

  get db (): any {
    return this.plugins.get('db')
  }

  /**
   * Creates a plugin
   * @arg {String} type The type of plugin
   * @arg {Plugin} Plugin Plugin class
   * @arg {Object} [options] Additional plugin options
   * @returns {Client}
   */
  createPlugin (type: string, Plugin: any, options: object): Server {
    const plugin = new Plugin(this, options)
    this.plugins.set(type, plugin)
    return this
  }

  register (type: string, ...args): Server {
    if (typeof type !== 'string') {
      throw new Error('Invalid type supplied to register')
    }
    const plugin = this.plugins.get(type)
    if (!plugin) {
      throw new Error(`Plugin type ${type} not found`)
    }
    if (typeof plugin.register === 'function') plugin.register(...args)
    return this
  }

  /**
   * Unregisters plugins
   * @arg {String} type The type of plugin<br />
   * Defaults: `commands`, `listeners`, `middleware`, `resolvers`, `ipc`
   * @arg {...*} args Arguments supplied to the plugin
   * @returns {Client}
   */
  unregister (type: string, ...args): Server {
    if (typeof type !== 'string') {
      throw new Error('Invalid type supplied to register')
    }
    const plugin = this.plugins.get(type)
    if (!plugin) {
      throw new Error(`Plugin type ${type} not found`)
    }
    if (typeof plugin.unregister === 'function') plugin.unregister(...args)
    return this
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

      return Promise.resolve()
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
