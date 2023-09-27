const express = require('express');
const db = require('./config/dbConnection');
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema } = require('graphql')
const jwt = require('jsonwebtoken');

const { query, mutation } = require('./graphql/schema');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', graphqlHTTP((req) => {
    let token = req.headers.authorization.split(' ').pop().trim();

    if (token === 'null') {
        console.log('here');
        return {
            graphiql: true,
            schema: new GraphQLSchema({
                query, mutation,
            })
        }
    }

    let context
    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        context = { userId };
    } catch(err) {
        console.error(err);
    }

    return {
    graphiql: true,
    schema: new GraphQLSchema({
        query, mutation,
    }),
    context
}}));

db.once('open', async () => {
    app.listen(PORT, () => {
        console.log(`Express server listening on port ${PORT}!`);
    });
});