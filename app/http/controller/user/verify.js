const Validator = require('validatorjs');
const { AuthCode } = require(`${root}/app/http/models`);

module.exports = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    const rules = {
      verificationCode: 'required|string',
    };

    const validation = new Validator(req.body, rules);
    if (validation.fails()) return res.status(400).json({ success: false, message: validation.errors.all() });

    const user = req.user;
    const authCode = await AuthCode.findOne({ where: { userId: user.id } });

    if (!authCode) return res.status(400).json({ success: false, message: 'Invalid verification code' });

    const validCode = authCode.validCode(verificationCode, authCode.code, authCode.expiresAt, authCode);

    if (!validCode) return res.status(400).json({ success: false, message: 'Invalid verification code' });

    if (validCode === 'Expired') {
      // New verification is handled in the model
      return res.status(400).json({
        success: false,
        message: 'Verification code expired, a new code has been sent to your email',
      });
    }

    authCode.destroy();

    user.verifiedAt = day().format('YYYY-MM-DD HH:mm:ss');
    user.save();

    return res.status(200).json({ success: true, message: 'Verification successful' });
  } catch (error) {
    log.error('Error in verify.js', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
