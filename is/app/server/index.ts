import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as routes from './routes';
import nextapp from './nextapp';
import { ApolloServer, gql } from 'apollo-server-express';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

interface ValidNameData {
  available: Boolean;
  slug: String;
}

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type ValidNameData {
    available: Boolean
    slug: String
  }

  # type PronounData {
  #   objective: [String]
  #   subjective: [String]
  # }

  # type LinkType {
  #   name: String
  #   icon: String
  #   attribute: String
  #   template: String
  # }

  type Query {
    validateName(name: String!): ValidNameData
    # getPronounList: [PronounData]
    # getLinkTypes: [LinkType]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    validateName(_, args): ValidNameData {
      return {
        available: true,
        slug: args.name
      };
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });
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
