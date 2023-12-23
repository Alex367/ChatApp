const { connectToDatabase } = require("../lib/db");
const jwt = require('jsonwebtoken');
const multer = require('multer')
const uploadError = multer().single('file')

exports.getUserInfo = async (req, res, next) => {
    const client = await connectToDatabase();
    const collection = await client.db("chat").collection("userCollection");

    const userInfo = await collection.findOne({ username: req.userData.user });
    if (!userInfo) {
        client.close();
        res.status(422).json({ message: "Data was not found about the user" });
        return;
    }

    client.close();
    res.status(201).json({ username: userInfo.username, email: userInfo.email, avatar: userInfo.avatar });
};

exports.patchUserInfo = async (req, res, next) => {

    const { email, username } = req.body;

    const client = await connectToDatabase();
    const collection = await client.db("chat").collection("userCollection");

    const userInfo = await collection.findOne({ username: req.userData.user });
    if (!userInfo) {
        client.close();
        res.status(422).json({ message: "Updating failed, data was not found about the user" });
        return;
    }

    // Validation
    if (userInfo.email === email && userInfo.username === username) {
        client.close();
        res.status(422).json({ message: "Nothing to update" });
        return;
    }

    await collection.updateOne(
        { _id: userInfo._id },
        {
            $set: { email: email, username: username }
        })

    // Token
    let token;
    try {
        token = jwt.sign({
            username: username,
            email: email,
        }, process.env.SECRET_TOKEN, { expiresIn: '1h' })
    } catch (err) {
        throw new Error('Something went wrong with the token');
    }

    const messageCollection = await client.db("chat").collection("chatCollection");

    await messageCollection.updateMany(
        { username: { $in: [req.userData.user] } },
        {
            $set: { username: username }
        })

    req.userData = { user: username };
    client.close();
    res.status(201).json({ email: email, username: username, token: token });
}

exports.sendAvatar = async (req, res, next) => {

    const client = await connectToDatabase();
    const collection = await client.db("chat").collection("userCollection");

    const userInfo = await collection.findOne({ username: req.userData.user });
    if (!userInfo) {
        client.close();
        res.status(422).json({ message: "Data was not found about the user" });
        return;
    }
    const newAvatarPath = "uploads/images/" + req.file.filename;
    await collection.updateOne(
        { username: req.userData.user },
        { $set: { avatar: newAvatarPath } }
    );

    client.close();

    console.log("BE avatar")
    res.status(201).json({ filename: req.file.filename, message: "Uploaded successfully!" });
};

exports.deleteAccount = async (req, res, next) => {

    const client = await connectToDatabase();
    const collection = await client.db("chat").collection("userCollection");

    const userInfo = await collection.findOne({ username: req.userData.user });
    if (!userInfo) {
        client.close();
        res.status(422).json({ message: "Data was not found about the user" });
        return;
    }

    await collection.deleteOne({ "username": req.userData.user });

    // Chat messages
    const collectionChat = await client.db("chat").collection("chatCollection");
    await collectionChat.deleteMany({ username: { $in: [req.userData.user] } });

    client.close();

    res.status(201).json({ message: "Account was deleted successfully!"});
};