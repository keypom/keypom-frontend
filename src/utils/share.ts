import copy from 'copy-to-clipboard';

const HELPER_URL = 'https://nearapi.secondx.app/';
const SHARE_URL = HELPER_URL + 'v1/share/';

const defaultTitle = 'NFTs on SecondX.app';
const defaultDescription = 'Click to bid on this NFT!';

export const share = async ({
  contract_id,
  token_id,
  link,
  title = defaultTitle,
  description = defaultDescription,
}) => {
  const url = await getShareUrl({
    contract_id,
    token_id,
    link,
    title,
    description,
  });

  if (window.navigator.share) {
    await window.navigator.share({
      title,
      text: description,
      url,
    });
  } else {
    copy(url);
    alert('Link Copied!');
  }
};

const getShareUrl = async ({
  contract_id,
  token_id,
  link,
  title = defaultTitle,
  description = defaultDescription,
}) => {
  return (
    await fetch(
      SHARE_URL +
        JSON.stringify({
          title,
          description,
          nft: { contract_id, token_id },
          redirect: encodeURIComponent(`${window.origin}${link as string}`),
        }),
    ).then(async (res) => await res.json())
  ).encodedUrl;
};
