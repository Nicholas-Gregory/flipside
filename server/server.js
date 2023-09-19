const express = require('express');
const db = require('./config/dbConnection');
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema } = require('graphql')

const { query, mutation } = require('./graphql/schema');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', graphqlHTTP({
    graphiql: true,
    schema: new GraphQLSchema({
        query, mutation
    })
}));

db.once('open', async () => {
    app.listen(PORT, () => {
        console.log(`Express server listening on port ${PORT}!`);
    });
});