import {
  Box,
  Button,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { formatNearAmount } from 'keypom-js';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { useAppContext, openMasterKeyModal } from '@/contexts/AppContext';
import { truncateAddress } from '@/utils/truncateAddress';

import { KeyIcon, NearIcon, SignOutIcon } from '../Icons';

export const SignedInButton = () => {
  const [showAll, setShowAll] = useBoolean(false);
  const [showNear, setShowNear] = useBoolean(false);
  const { setAppModal } = useAppContext();

  const { account, selector } = useAuthWalletContext();

  const handleSignOut = async () => {
    if (!selector.isSignedIn()) {
      console.error('Not signed in');
      return;
    }
    const wallet = await selector.wallet();

    wallet
      .signOut()
      .then((_) => {
        sessionStorage.removeItem('account');
        window.location.href = '';
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to sign out');
        // eslint-disable-next-line no-console
        console.error(err);
      });
  };

  const handleMasterKey = async () => {
    openMasterKeyModal(setAppModal, null, null);
  };

  const getAccountBalance = () => {
    if (account === null) return null;

    const amountInNEAR = formatNearAmount(account.amount, 4);

    if (amountInNEAR === null) {
      console.error('Account amount is null');
      return 0;
    }

    return amountInNEAR;
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
              closeOnSelect={false}
              icon={<NearIcon height="3.5" mt="-0.5" width="3.5" />}
              onClick={setShowNear.toggle}
            >
              <Flex>
                <Text
                  fontWeight="medium"
                  maxWidth={showNear ? 'initial' : '100'}
                  mr="1"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {getAccountBalance()}
                </Text>
              </Flex>
            </MenuItem>

            <MenuItem icon={<KeyIcon height="15px" width="14px" />} onClick={handleMasterKey}>
              Site Password
            </MenuItem>
            <MenuItem icon={<SignOutIcon />} onClick={handleSignOut}>
              Sign out
            </MenuItem>
          </MenuList>
        </Box>
      )}
    </Menu>
  );
};
