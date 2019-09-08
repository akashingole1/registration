const {User, validate} = require('../model/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async function f(req, res) {

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let findUser = await User.findOne({email: req.body.email});
    if (findUser) return res.status(400).send('User already registered');

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10,);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();
    console.log("user saved", user);

    res.send(_.pick(user, ['_id', 'name', 'email', 'password']));
    // res.send({
    //     name: user.name
    // });
});

module.exports = router;