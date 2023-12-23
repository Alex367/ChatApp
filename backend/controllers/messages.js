const { connectToDatabase } = require("../lib/db");
const { ObjectId } = require('mongodb');

exports.getAllMessages = async (req, res, next) => {
    let client;

    try {
        client = await connectToDatabase();
    } catch (error) {
        res.status(501).json({ message: "Something went wrong with DB connection" });
        return;
    }

    const collection = await client.db("chat").collection("chatCollection");
    const data = await collection.find({}).toArray();
    client.close();

    res.status(201).json(data);
};

exports.postMessage = async (req, res, next) => {
    const { username, message } = req.body;
    if (message.trim().length === 0 || message.trim().length > 30) {
        res.status(422).json({ message: "Invalid Input" });
        return;
    }

    // db
    const client = await connectToDatabase();
    const collection = await client.db("chat").collection("chatCollection");

    await collection.insertOne({ username: username, text: message });

    client.close();

    res.status(200).json({ message: "Message was sent correctly" });
};

exports.deleteMessage = async (req, res, next) => {
    const { id_item, user_item } = req.body;
    const id = new ObjectId(id_item);

    if (user_item !== req.userData.user) {
        res.status(422).json({ message: "Something went wrong with authorization" });
        return;
    }

    const client = await connectToDatabase();
    let collection;
    try {
        collection = await client.db("chat").collection("chatCollection");
    } catch (err) {
        res.status(500).json({ message: "Something went wrong with DB connection" });
        client.close();
        return;
    }

    await collection.deleteOne({ "_id": id });
    client.close();
    res.status(200).json({ message: "Message was removed correctly" });
};