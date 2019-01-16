import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';

import Schema from './server/schemas';

const app = express();

app.use(express.static(path.join(__dirname, 'client/dist')));

app.use(bodyParser.json());

app.use(
  '/api',
  graphqlHTTP({
    schema: Schema,
    graphiql: true
  })
);

const port = 3000;

app.get('/', (_, res) => res.send('Not Here'));

app.get('/profile/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
