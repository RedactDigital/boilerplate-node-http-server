const { randomBytes } = require('crypto');
const Validator = require('validatorjs');
const { getClientIp } = require('request-ip');
const { isValidPhoneNumber, parsePhoneNumber } = require('libphonenumber-js');

const { User, AuthCode } = require(`${root}/app/http/models`);
const signJWT = require(`${root}/app/http/middleware/passport/signJWT`);

module.exports = async (req, res) => {
  const { email, firstName, lastName, password, phone, country } = req.body;

  // Define validation for phone number
  Validator.register(
    'phone',
    value => {
      return isValidPhoneNumber(value, country);
    },
    'Invalid phone number'
  );

  // Define rules for validation
  const rules = {
    email: 'required|email',
    firstName: 'required',
    lastName: 'required',
    password: 'required|min:8|max:64',
    phone: 'phone',
  };

  const validation = new Validator(req.body, rules);
  if (validation.fails()) return res.status(400).json({ success: false, message: validation.errors.all() });

  // Ensure that email is not already registered
  const user = await User.findOne({ where: { email }, paranoid: false });
  if (user && user.deletedAt === null)
    return res.status(400).json({ success: false, message: 'Email is already registered' });
  if (user && user.deletedAt !== null) {
    await user.restore();
    return res.json({ success: true, message: 'User has been restored. Please login' });
  }

  // Ensure that phone number is not already registered
  const userPhone = await User.findOne({
    where: { phone: parsePhoneNumber(phone, country).formatInternational() },
    paranoid: false,
  });
  if (userPhone && userPhone.deletedAt === null)
    return res.status(400).json({ success: false, message: 'Phone number is already registered' });
  if (userPhone && userPhone.deletedAt !== null) {
    await userPhone.restore();
    return res.json({ success: true, message: 'User has been restored. Please login' });
  }

  // Create user
  const createdUser = await User.create({
    email,
    password, // This is hashed in the model
    firstName,
    lastName,
    phone: phone ? parsePhoneNumber(phone, country).formatInternational() : null,
  });

  const verificationCode = await AuthCode.create({
    userId: createdUser.id,
    code: process.env.NODE_ENV === 'production' ? randomBytes(3).toString('hex') : '111111',
    type: 'signup',
    expiresAt: day().add(1, 'day'),
  });

  // Generate jwt token
  const { token } = await signJWT(createdUser, getClientIp(req));

  const newUser = await User.findOne({
    where: { id: createdUser.id },
  });

  // TODO - email notification

  return res.status(200).json({ success: true, user: newUser, verificationCode, token });
};
