import * as CryptoJS from 'crypto-js';

export const encrypt = (message: string, key: string) => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

export const decrypt = (encrypted: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);

  if (bytes.toString() === '') {
    throw new Error('Invalid passphrase');
  }

  return bytes.toString(CryptoJS.enc.Utf8);
};
