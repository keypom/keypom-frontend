import {
  Box,
  Button,
  Center,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useBoolean,
} from '@chakra-ui/react';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { useAppContext, setAppModalHelper } from '@/contexts/AppContext';
import { toYocto } from '@/utils/toYocto';
import { truncateAddress } from '@/utils/truncateAddress';

import { DropIcon, NearLogoIcon, SignOutIcon } from '../Icons';

export const SignedInButton = () => {
  const [showAll, setShowAll] = useBoolean(false);
  const { setAppModal } = useAppContext();

  const { account, selector } = useAuthWalletContext();
  const amountInYocto = toYocto(account === null ? 0 : parseInt(account.amount));

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet
      .signOut()
      .then((_) => {
        sessionStorage.removeItem('account');
        window.location.href = '';
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Failed to sign out');
        // eslint-disable-next-line no-console
        console.error(err);
      });
  };

  const handleMasterKey = async () => {
    setAppModalHelper(setAppModal);
  };

  return (
    <Menu
      placement="bottom-end"
      onClose={() => {
        setShowAll.off();
      }}
      onOpen={() => {
        setShowAll.on();
      }}
    >
      {({ isOpen }) => (
        <Box>
          <MenuButton
            as={Button}
            bg="border.box"
            border="2px solid transparent"
            borderRadius="3.25rem"
            isActive={isOpen}
            px="6"
            py="3"
          >
            <Center>
              <Box
                bg="pink.400"
                border="1px solid"
                borderColor="pink.200"
                borderRadius="full"
                h="4"
                mr="2"
                w="4"
              />
              {account === null || account === undefined ? (
                <Spinner />
              ) : (
                <Text>{showAll ? account.account_id : truncateAddress(account.account_id)}</Text>
              )}
            </Center>
          </MenuButton>
          <MenuList>
            <MenuItem
              borderBottom="1px solid"
              borderBottomColor="gray.100"
              icon={<NearLogoIcon height="3.5" width="3.5" />}
            >
              <Flex>
                <Text
                  fontWeight="medium"
                  maxW="80px"
                  mr="1"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {amountInYocto}
                </Text>
                NEAR
              </Flex>
            </MenuItem>

            <MenuItem icon={<SignOutIcon />} onClick={handleMasterKey}>
              Master Key
            </MenuItem>
            <Link href="/drops">
              <MenuItem icon={<DropIcon />}>My drops</MenuItem>
            </Link>
            <MenuItem icon={<SignOutIcon />} onClick={handleSignOut}>
              Sign out
            </MenuItem>
          </MenuList>
        </Box>
      )}
    </Menu>
  );
};
