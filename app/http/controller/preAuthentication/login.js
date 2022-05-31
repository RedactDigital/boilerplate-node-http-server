const { Op } = require('sequelize');
const { getClientIp } = require('request-ip');
const Validator = require('validatorjs');
const { User, AuthCode } = require(`${root}/app/http/models`);
const signJWT = require(`${root}/app/http/middleware/passport/signJWT`);

module.exports = async (req, res) => {
  const { email, phone, password } = req.body;

  // TODO - validate email and phone as required fields

  // Define rules for validation
  const rules = {
    email: 'email',
    password: 'required',
  };

  const validation = new Validator(req.body, rules);
  if (validation.fails()) return res.status(400).json({ success: false, message: validation.errors.all() });

  // Find user
  let user = await User.findOne({
    where: { [Op.or]: [{ email: email || '' }, { phone: phone || '' }] },
    attributes: {
      include: ['password'],
    },
    include: [{ model: AuthCode, as: 'authCode' }],
  });

  // Check if user exists
  if (!user) return res.status(401).json({ success: false, message: 'Invalid email/phone or password' });

  // Check password
  if (!user || !user.validPassword(password))
    return res.status(401).json({ success: false, message: 'Invalid email/phone or password' });

  // Generate jwt token
  const { token } = await signJWT(user, getClientIp(req));

  // Check if user is verified
  if (user.authCode && user.authCode.type == 'signup') {
    return res.status(401).json({ success: false, message: 'User is not verified', token });
  }

  // Remove password from response by getting the user again
  user = await User.findOne({
    where: { [Op.or]: [{ email: email || '' }, { phone: phone || '' }] },
  });

  return res.status(200).json({ success: true, user, token });
};
