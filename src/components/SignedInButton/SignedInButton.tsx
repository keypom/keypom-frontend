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
  Text,
} from '@chakra-ui/react';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { toYocto } from '@/utils/toYocto';

import { DropIcon, NearLogoIcon, SignOutIcon } from '../Icons';

export const SignedInButton = () => {
  const { account, selector } = useAuthWalletContext();
  const amountInYocto = toYocto(+account.amount);

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet
      .signOut()
      .then((res) => (window.location.href = ''))
      .catch((err) => {
        console.log('Failed to sign out'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
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
              <Text>{account.account_id}</Text>
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
            <Link href="/drops">
              <MenuItem icon={<DropIcon />}>My drops</MenuItem>
            </Link>
            {/** https://github.com/typescript-eslint/typescript-eslint/issues/4619 */}
            <MenuItem
              icon={<SignOutIcon />}
              onClick={() => {
                void handleSignOut();
              }}
            >
              Sign out
            </MenuItem>
          </MenuList>
        </Box>
      )}
    </Menu>
  );
};
