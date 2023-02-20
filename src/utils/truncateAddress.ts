export const truncateAddress = (address: string) => {
  if (address.length > 24) {
    return address.slice(0, 4) + '...' + address.slice(-6);
  }

  return address;
};
