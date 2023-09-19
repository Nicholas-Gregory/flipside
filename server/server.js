const express = require('express');
const db = require('./config/dbConnection');

const { User } = require('./models')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.once('open', async () => {
    app.listen(PORT, () => {
        console.log(`Express server listening on port ${PORT}!`);
    });
});