const jwt = require('jsonwebtoken');

exports.CheckToken = (req, res, next) => {

    if(req.method === 'OPTIONS'){
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Bearer Token
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        // add to the request a parameter in order to identify users behaviour, for ex 
        // differentiate users during deletions of items
        req.userData = { user: decodedToken.username };
        next();
    } catch (err) {
        throw new Error('Authentication failed!');
    }
}