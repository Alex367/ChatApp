const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const { createServer } = require('node:http');
const { Server } = require('socket.io');

const checkAuth = require('./middleware/token-middleware');

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    next();
})

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: `http://localhost:${process.env.FRONT_PORT}`, methods: ["GET", "POST"]
    }
});


// Routes
const homeRoutes = require('./routes/home');
const registrationRoutes = require('./routes/registration');
const loginRoutes = require('./routes/login');
const settingsRoutes = require('./routes/settings');
const changePasswordRoutes = require('./routes/changePassword');

app.use(registrationRoutes);
app.use(loginRoutes);

// Middleware with token; all routes below are protected
app.use(checkAuth.CheckToken);

app.use(settingsRoutes);
app.use(homeRoutes);
app.use(changePasswordRoutes);

io.on('connection', (socket) => {
    socket.on("send_message", (data) => {
        // console.log(data);
        socket.broadcast.emit("receive_message", data);
        socket.emit("receive_message", data);
    });

    socket.on("delete_message", (data) => {
        // console.log(data);
        socket.broadcast.emit("receive_deleted_message", data);
        socket.emit("receive_deleted_message", data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Middleware for 404 pages
app.use((req, res, next) => {
    throw new Error('Page can not be found');
})

// Middleware for errors
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
})

server.listen(process.env.PORT, () => {
    console.log('server is running');
});
