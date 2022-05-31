const { Router } = require('express');
const PreAuth = require(`${root}/app/http/controller/preAuthentication`);

const preAuth = new Router();

module.exports = preAuth
  .get('/', (req, res) => {
    return res.status(200).json({ success: true });
  })

  .get('/assistant-count', PreAuth.getNumberOfAssistants)

  .post('/register', PreAuth.register)

  .post('/login', PreAuth.login);

// TODO - Add reset password
// TODO - Add resend verification
// TODO - verify account needs to be done before auth

// TODO - Logout needs to add jwt token to blacklist table (can hit blacklist mutation for this)
// TODO - Add endpoint to invalidate jwt token (add to blacklist table)

// TODO - Create delete account endpoint (can be graphql) On delete of account blacklist jwt tokens
// TODO - Create update password endpoint (can be graphql)
