export async function generateKeyPair(): Promise<{
  privateKey: any;
  publicKey: any;
}> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: 'SHA-256' },
    },
    true,
    ['encrypt', 'decrypt'],
  );
}

export function uint8ArrayToBase64(u8Arr: Uint8Array): string {
  const string = u8Arr.reduce((data, byte) => data + String.fromCharCode(byte), '');
  return btoa(string);
}

export async function encryptPrivateKey(
  privateKey: any,
  symmetricKey: any,
): Promise<{ encryptedPrivateKeyBase64: string; ivBase64: string }> {
  const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', privateKey);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedPrivateKey = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    symmetricKey,
    exportedPrivateKey,
  );

  const encryptedBase64 = uint8ArrayToBase64(new Uint8Array(encryptedPrivateKey));
  const ivBase64 = uint8ArrayToBase64(iv);

  return { encryptedPrivateKeyBase64: encryptedBase64, ivBase64 };
}

export async function exportPublicKeyToBase64(publicKey: any) {
  // Export the key to the SPKI format
  const exportedKey = await crypto.subtle.exportKey('spki', publicKey);

  // Convert the exported key to a Base64 string
  const base64Key = arrayBufferToBase64(exportedKey);

  return base64Key;
}

export function arrayBufferToBase64(buffer: any) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function deriveKeyFromPassword(password: string, saltBase64: string): Promise<any> {
  // Convert Base64-encoded salt back to Uint8Array
  const salt = Uint8Array.from(atob(saltBase64), (c) => c.charCodeAt(0));

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
}

export async function decryptPrivateKey(
  encryptedPrivateKeyBase64: string,
  ivBase64: string,
  symmetricKey: any,
): Promise<any> {
  const encryptedPrivateKey = Uint8Array.from(atob(encryptedPrivateKeyBase64), (c) =>
    c.charCodeAt(0),
  );
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const decryptedPrivateKeyBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    symmetricKey,
    encryptedPrivateKey,
  );

  return await window.crypto.subtle.importKey(
    'pkcs8',
    decryptedPrivateKeyBuffer,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' },
    },
    true,
    ['decrypt'],
  );
}

export async function decryptWithPrivateKey(
  encryptedData: string,
  privateKey: any,
): Promise<string> {
  const encryptedDataArrayBuffer = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0),
  ).buffer;

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    encryptedDataArrayBuffer,
  );

  return new TextDecoder().decode(decrypted);
}
