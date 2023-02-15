export const get = (key: string) => {
  const value = localStorage.getItem(key);
  if (value !== null) {
    if (!/\{|\[/.test(value?.charAt(0))) {
      return value;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
    }
  }
};
export const set = (key: string, value: unknown) => {
  localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
};
export const del = (key: string) => {
  localStorage.removeItem(key);
};

export const getFileAsBase64 = async (file) =>
  await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });

export const getBase64AsFile = (base64) => {
  const base64Parts = base64.split(',');
  const fileFormat = base64Parts[0].split(';')[1];
  const fileContent = base64Parts[1];
  const file = new File([fileContent], 'file', { type: fileFormat });
  return file;
};

export const setFile = async (key, file) => {
  localStorage.setItem(key, (await getFileAsBase64(file)) as string);
};

export const getFile = (key) => {
  const base64 = localStorage.getItem(key);
  if (!base64) return;
  return getBase64AsFile(base64);
};
