const {User} = require('../model/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async function f(req, res) {

    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let findUser = await User.findOne({email: req.body.email});
    if (!findUser) return res.status(400).send('Invalid email or password');

    const validpassword = await bcrypt.compare(req.body.password, findUser.password)
    if (!validpassword) return res.status(400).send('Invalid email or password');

    const result = jwt.sign({_id: findUser._id}, config.get('jwtprivatekey'));
    res.send(result);
    // res.send(true);
    //JSON Web Token is a long string for identifying the user
    /**
     * client logs in to server and server sends a JWT to client for the first time
     * client saves JWT in local storage and next when wants to make api call,
     * the client should show JWT to the server as a proof.
     * JWT has header, payload and verifying signature.
     */

});

function loginValidation(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);

}

module.exports = router;