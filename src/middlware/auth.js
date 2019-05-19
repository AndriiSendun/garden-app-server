const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('auth-token');

  //Check for token
  if(!token) {
    return res.status(401).json({message: 'Yo have not token, access denie'});
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, config.get('JWT'));

    //Add user from payload
    req.user = decoded;
    next();
  } catch(err) {
    res.status(400).json({message: 'Invalid token'});
  }
}

module.exports = auth;
