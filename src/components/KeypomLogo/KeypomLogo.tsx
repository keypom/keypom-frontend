import { Link, Image } from '@chakra-ui/react';

export const KeypomLogo = () => {
  return (
    <Link href="/">
      <Image alt="keypom-logo" src="/assets/logo_white.png" w={{ base: '102px', md: '156px' }} />
    </Link>
  );
};
