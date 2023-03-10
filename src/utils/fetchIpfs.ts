import { CLOUDFLARE_IPFS } from '@/constants/common';

export const getIpfsData = async (cid: string) => {
  // Storing response
  const url = `${CLOUDFLARE_IPFS}/${cid}`;
  const response = await fetch(url);

  // Storing data in form of JSON
  const data = await response.json();
  return data;
};
