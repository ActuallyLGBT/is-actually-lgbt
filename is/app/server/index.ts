import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as routes from './routes';
import * as path from 'path'
import * as db from './db';
import nextapp from './nextapp';
import { ApolloServer, gql } from 'apollo-server-express';

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
      return {
        available: true,
        slug: args.name
      };
    },
    getPronounList(): PronounData {
      return {
        objective: ['He', 'She', 'They'],
        subjective: ['Him', 'Her', 'Them']
      };
    },
    getLinkTypes(): LinkType[] {
      return [
        {
          name: 'GitHub',
          icon: 'fab fa-github',
          attribute: 'username',
          template: 'https://github.com/{username}'
        },
        {
          name: 'Twitter',
          icon: 'fab fa-twitter',
          attribute: 'username',
          template: 'https://twitter.com/{username}'
        }
      ];
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

db.register(resolve('schema'))

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
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  } catch (err) {
    console.error(err.message);
  }
})();
