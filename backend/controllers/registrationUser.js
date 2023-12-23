const { hash } = require("bcryptjs");
const { connectToDatabase } = require("../lib/db");
const jwt = require('jsonwebtoken');

exports.postRegistration = async (req, res, next) => {

    const { username, email, password, repeatPassword } = req.body;

    // Validation
    if (password !== repeatPassword || !username || !email ||
        !password || !repeatPassword || !email.includes("@") || password.trim().length < 3) {
        res.status(422).json({ message: "Something went wrong. Try again." });
        return;
    }

    // DB
    const client = await connectToDatabase();
    const collection = await client.db("chat").collection("userCollection");

    // Check if an user is already exists by email
    let resultEmail;
    try {
        resultEmail = await collection.findOne({ email: email });
    } catch (error) {
        res.status(422).json({ message: "Something went wrong. Try again." });
        client.close();
        return;
    }

    if (resultEmail) {
        res.status(422).json({ message: "User with that email is already exists" });
        client.close();
        return;
    }

    // Check if an user is already exists by username, Username should be unique
    let resultUsername;
    try {
        // insensetive search
        resultUsername = await collection.findOne({ username: new RegExp(username, 'i') });
    } catch (error) {
        res.status(422).json({ message: "Something went wrong" });
        client.close();
        return;
    }

    if (resultUsername) {
        res.status(422).json({ message: "Username should be unique" });
        client.close();
        return;
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Add to the DB
    await collection.insertOne({ username, email, password: hashedPassword, avatar: 'uploads/images/default.jpg'});

    client.close();

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

    res.status(201).json({
        message: "Registration successfully finished!",
        username,
        token,
        avatar: 'uploads/images/default.jpg'
    });
};
