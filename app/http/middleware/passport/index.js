const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require(`${root}/app/http/models`);
const fs = require('fs');

// index.js will pass the global passport object here, and this function will configure it
module.exports = async passport => {
  const publicKey = fs.readFileSync(`${root}/storage/oauth-public.pem`);
  passport.initialize();

  // At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
    algorithms: [process.env.JWT_ALGORITHM],
    issuer: process.env.API_URL,
    audience: process.env.APP_URL,
  };

  // The JWT payload is passed into the verify callback
  passport.use(
    new Strategy(jwtOptions, async (tokenPayload, done) => {
      try {
        const user = await User.findByPk(tokenPayload.sub);

        user.ip = tokenPayload.ip;
        user.geoLocation = tokenPayload.geoLocation;

        if (user) return done(null, user);

        return done(null, false);
      } catch (err) {
        log.error('Passport Error: ', err);
        return done(err, false);
      }
    })
  );
};
