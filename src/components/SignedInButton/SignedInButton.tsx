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
} from '@chakra-ui/react';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { useAppContext } from '@/contexts/AppContext';
import { toYocto } from '@/utils/toYocto';
import { truncateAddress } from '@/utils/truncateAddress';
import { set } from '@/utils/localStorage';

import { DropIcon, NearLogoIcon, SignOutIcon } from '../Icons';

export const SignedInButton = () => {
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
    setAppModal({
      isOpen: true,
      header: 'Set your master key!',
      message: 'hello world!',
      inputs: [
        {
          placeholder: 'Master Key',
          valueKey: 'masterKey',
        },
      ],
      options: [
        {
          label: 'Cancel',
          func: () => {
            // eslint-disable-next-line no-console
            console.log('user cancelled');
          },
        },
        {
          label: 'Set Master Key',
          func: ({ masterKey }) => {
            set('MASTER_KEY', masterKey);
          },
        },
      ],
    });
  };

  return (
    <Menu>
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
                <Text>{truncateAddress(account.account_id)}</Text>
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
