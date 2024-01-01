const { compare } = require("bcryptjs");
const { connectToDatabase } = require("../lib/db");
const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || !email.includes("@")) {
        res.status(422).json({ message: "Something went wrong. Try again." });
        return;
    }

    // DB
    const client = await connectToDatabase();
    const collection = await client.db("chat").collection("userCollection");

    // Try to find a user
    const existedUser = await collection.findOne({ email: email });
    if (!existedUser) {
        client.close();
        res.status(422).json({ message: "User doesn't exist. Try again." });
        return;
    }

    // Compare with hash password
    const isValid = await compare(
        password, existedUser.password
    )
    if (!isValid) {
        client.close();
        res.status(422).json({ message: "Invalid Input. Try again." });
        return;
    }
    client.close();

    // Token
    let token;
    try {
        token = jwt.sign({
            username: existedUser.username,
            email,
            role: existedUser.role
        }, process.env.SECRET_TOKEN, { expiresIn: '1h' })
    } catch (err) {
        throw new Error('Something went wrong with the token');
    }

    res.status(201).json(
        { message: "Login successfully finished!", username: existedUser.username, token: token, avatar: existedUser.avatar }
    );
};