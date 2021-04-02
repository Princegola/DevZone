// var express = require('express');
import express from 'express';

class Server {
    app;
    constructor() {
        this.app = express ();
    }

    bootstrap() {
        this.setUpRoutes();
        return this;
    }

    setUpRoutes() {
        this.app.use('/health-check', (req, res) => {
            res.send('I am Ok');
        });
    }

    run() {
        const { app } = this;
        const PORT = process.env.PORT || 3000;
        app.listen(PORT,() => console.log(`Server is running on ${PORT}`));
    }
}

export default Server;


