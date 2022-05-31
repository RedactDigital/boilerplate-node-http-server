const AesEncryption = require('aes-encryption');
const aes = new AesEncryption();

aes.setSecretKey(process.env.ENCRYPTION_SECRET);
module.exports = {
  encrypt(input) {
    try {
      if (!input) return null;
      return aes.encrypt(input);
    } catch (err) {
      log.error('Encryption error', err);
      return null;
    }
  },
  decrypt(input) {
    try {
      if (!input) return null;
      return aes.decrypt(input);
    } catch (e) {
      log.error('Decryption failed', e);
      return null;
    }
  },
};
