const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require("../models/user.model");
const User_DB = [];

exports.register = (req, res) => {
  var newUser = new User(req.body.username, bcrypt.hashSync(req.body.password, 10));
  User_DB.push(newUser);

  return res.status(201).json({
    "msg": "New User created !"
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  const user = User_DB.find((u) => u.username === username && bcrypt.compareSync(password, u.password));

  if (user) {
    const accessToken = jwt.sign({ username: user.username, exp: Math.floor(Date.now() / 1000) + 120 }, process.env.ACCESS_JWT_KEY);
    return res.status(200).send(accessToken);
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

exports.authenticate = (req, res) => {
  let authHeader = req.headers["authorization"];
  let token;

  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7, authHeader.length);
    token = jwt.verify(token, process.env.ACCESS_JWT_KEY);

    let user_found = User_DB.some(user => {
      if (user.username == token.username) {
        return true;
      }
    });

    if (user_found)
      return res.status(200).send();
    else
      return res.status(401).send();
  } else {
    return res.status(401).send();
  }
};