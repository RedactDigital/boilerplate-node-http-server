const jwt = require('jsonwebtoken');
const geoip = require('geoip-lite');
const fs = require('fs');

module.exports = async function issueJWT(user, ipAddress) {
  try {
    const { id } = user;
    const geoLocation = geoip.lookup(ipAddress);

    const options = {
      expiresIn: process.env.JWT_EXPIRATION || '2w',
      algorithm: process.env.JWT_ALGORITHM,
      issuer: process.env.API_URL,
      audience: process.env.APP_URL,
    };

    const payload = {
      sub: id,
      iat: day().unix(),
      ip: ipAddress,
      geoLocation,
    };

    const privateKey = fs.readFileSync(`${root}/storage/oauth-private.pem`);

    const signedToken = jwt.sign(payload, privateKey, options);

    return {
      token: signedToken,
    };
  } catch (err) {
    log.error('Error issuing JWT', err);
    return null;
  }
};
