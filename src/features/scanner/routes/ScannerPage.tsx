/* eslint-disable @typescript-eslint/no-misused-promises */
import { Badge, Box, Center, Heading, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Account, KeyPair } from 'near-api-js';
import { useParams } from 'react-router-dom';

import nearConfig from '@/utils/near';
import { hash } from '@/utils/crypto';
import { ViewFinder } from '@/components/ViewFinder';

const { connection, contractId, accountSuffix, networkId, keyStore } = nearConfig;

export const gas = '100000000000000';

export const view = async (methodName, args) => {
  const account = new Account(connection, accountSuffix.substring(1));
  return await account.viewFunction(contractId, methodName, args);
};

export const getClaimAccount = (secretKey) => {
  const account = new Account(connection, contractId);
  keyStore.setKey(networkId, contractId, KeyPair.fromString(secretKey));
  return account;
};

export const call = (account, methodName, args, _gas = gas) => {
  return account.functionCall({
    contractId,
    methodName,
    args,
    gas: _gas,
  });
};

const Scanner = () => {
  const { password } = useParams();
  const [valid, setValid] = useState<string | boolean | null>(null);

  const claim = async (secretKey) => {
    const keyPair = KeyPair.fromString(secretKey);
    const publicKey = keyPair.getPublicKey().toString();
    let keyInfo = await view('get_key_information', { key: publicKey });

    if (keyInfo?.remaining_uses === 1) return false;

    const userAccount = getClaimAccount(keyPair.toString());
    await call(userAccount, 'claim', {
      account_id: `testnet`,
      password: password !== undefined ? await hash(`${password}${publicKey}1`) : undefined,
    });

    // fast return from scanner, tx in flight
    // if (keyInfo?.remaining_uses === 2) return true

    keyInfo = await view('get_key_information', { key: publicKey });
    return keyInfo?.remaining_uses === 1;
  };

  const handleResult = async (result, error) => {
    if (result != null) {
      try {
        const res = await claim(result.getText());
        setValid(res);
      } catch (e) {
        setValid('Network Error. Reload Scanner. Try ticket again but please admit the attendee.');
      }
    }

    if (error != null) {
      // eslint-disable-next-line no-console
      console.info(error);
    }
  };

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Heading textAlign="center">Scanner</Heading>
          {/** keypom scanner placeholder */}
          {valid === null && (
            <Center h={{ base: '280px', md: '440px' }} w={{ base: '280px', md: '440px' }}>
              <QrReader
                constraints={{ facingMode: 'environment' }}
                containerStyle={{ width: '100%', height: '100%' }}
                ViewFinder={() => <ViewFinder />}
                onResult={handleResult}
              />
            </Center>
          )}
          <Center>
            {valid === null && <Badge colorScheme="yellow">Scan Ticket</Badge>}
            {valid === true && <Badge colorScheme="green">Valid Ticket</Badge>}
            {valid === false && <Badge colorScheme="red">Invalid Ticket</Badge>}
            {typeof valid === 'string' && <Badge colorScheme="red">{valid}</Badge>}
          </Center>
        </VStack>
      </Center>
    </Box>
  );
};

export default Scanner;
