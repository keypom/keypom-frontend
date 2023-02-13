export const hash = async (string: string, from: BufferEncoding = 'utf8') => {
  const bytes = Buffer.from(string, from);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
  return hashHex;
};
