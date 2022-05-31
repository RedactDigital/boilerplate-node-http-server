const { Router } = require('express');
const passport = require('passport');
require(`${root}/app/http/middleware/passport`)(passport);
const User = require(`${root}/app/http/controller/user`);

const user = new Router();

module.exports = user
  .use(passport.authenticate('jwt', { session: false }))

  .post('/verify', User.verify);
