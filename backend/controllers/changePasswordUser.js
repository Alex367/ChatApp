const { connectToDatabase } = require("../lib/db");
const { compare, hash } = require("bcryptjs");

exports.changePassword = async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;

    // Validation
    if (oldPassword === newPassword || newPassword.trim().length < 3) {
        res.status(422).json({ message: "Something with inputs" });
        return;
    }

    const client = await connectToDatabase();
    const collection = await client.db("chat").collection("userCollection");

    const userInfo = await collection.findOne({ username: req.userData.user });
    if (!userInfo) {
        client.close();
        res.status(422).json({ message: "Data was not found about the user" });
        return;
    }

    // Check old password with password in DB
    const isValidPassword = await compare(oldPassword, userInfo.password);
    if (!isValidPassword) {
        res.status(403).json({ message: "Invalid password" });
        client.close();
        return;
    }

    const hashedPassword = await hash(newPassword, 12);
    await collection.updateOne(
        { username: req.userData.user },
        { $set: { password: hashedPassword } }
    );

    client.close();
    res.status(201).json({ message: "Password was successfully changed" });

};