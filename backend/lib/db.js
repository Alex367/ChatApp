const mongo = require('mongodb');

const connectToDatabase = async () => {
    const client = await mongo.MongoClient.connect(
        `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.ftiwdiy.mongodb.net/?retryWrites=true&w=majority`
    );
    return client;
}

module.exports = { connectToDatabase };