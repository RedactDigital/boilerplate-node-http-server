/**
 * This module will generate a public and private keypair and save to current directory
 *
 * Make sure to save the private key elsewhere after generated!
 */
const crypto = require('crypto');
const { exit } = require('process');
const fs = require('fs');

const genKeyPair = async () => {
  try {
    if (fs.existsSync(`${root}/storage/oauth-private.pem`) && fs.existsSync(`${root}/storage/oauth-public.pem`)) {
      log.warn(`OAuth keypair already exists!`);
      exit();
    }
    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const keyPair = await crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096, // bits - standard for RSA keys
      publicKeyEncoding: {
        type: 'pkcs1', // "Public Key Cryptography Standards 1"
        format: 'pem', // Most common formatting choice
      },
      privateKeyEncoding: {
        type: 'pkcs1', // "Public Key Cryptography Standards 1"
        format: 'pem', // Most common formatting choice
      },
    });

    log.warn('Generating new key pair');

    fs.writeFileSync(`${root}/storage/oauth-public.pem`, keyPair.publicKey);
    fs.writeFileSync(`${root}/storage/oauth-private.pem`, keyPair.privateKey);

    log.warn('Key pair generated');

    exit();
  } catch (err) {
    log.error('Error generating key pair: ', err);
    exit();
  }
};

// Generate the keypair
genKeyPair();
