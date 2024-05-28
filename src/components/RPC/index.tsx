import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Center,
  Text,
  IconButton,
  useBreakpointValue,
  Heading,
  HStack,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

import { getExtendConfig } from '@/config/config';

const MAXELOADTIMES = 3;

const RpcList = () => {
  const rpclist = getExtendConfig().RPC_LIST;
  const [hover, setHover] = useState(false);
  const [responseTimeList, setResponseTimeList] = useState({});
  let currentEndPoint = localStorage.getItem('endPoint') || 'defaultRpc';

  if (!rpclist[currentEndPoint]) {
    currentEndPoint = 'defaultRpc';
    localStorage.removeItem('endPoint');
  }

  useEffect(() => {
    Object.entries(rpclist).forEach(([key, data]) => {
      ping(data.url, key).then((time) => {
        responseTimeList[key] = time;
        setResponseTimeList(Object.assign({}, responseTimeList));
      });
    });
  }, []);

  const minWidth = '180px';
  const maxWidth = '230px';
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {isMobile ? (
        <Box bottom="0" position="fixed" w="100%" zIndex="99998">
          <Flex alignItems="end" w="100%">
            <Box
              position="relative"
              pt="3"
              w="100%"
              onClick={() => {
                setHover((prev) => !prev);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
            >
              <Flex
                alignItems="center"
                bg="white"
                boxShadow="0px 0px 10px 10px rgba(0, 0, 0, 0.15)"
                cursor="pointer"
                height="25px"
                justifyContent="space-between"
                w="100%"
              >
                <HStack h="25px" justifyContent="space-between" px="8" w="100%">
                  <Flex alignItems="center">
                    <Heading
                      isTruncated
                      color="gray.500"
                      cursor="pointer"
                      fontWeight="normal"
                      pr="3"
                      size="xs"
                    >
                      {rpclist[currentEndPoint].simpleName}
                    </Heading>
                  </Flex>
                  <Flex alignItems="center">
                    <Heading color="gray.500" fontWeight="normal" size="xs">
                      {displayCurrentRpc(responseTimeList, currentEndPoint)}
                    </Heading>
                    <IconButton
                      aria-label="Expand"
                      color="primaryText"
                      icon={<ChevronDownIcon />}
                      transform={hover ? 'rotate(180deg)' : 'rotate(0)'}
                      variant="ghost"
                    />
                  </Flex>
                </HStack>
              </Flex>
              <Center>
                <Box
                  bg="white"
                  borderRadius="md"
                  bottom="8"
                  boxShadow="0px 0px 10px 10px rgba(0, 0, 0, 0.15)"
                  display={hover ? 'flex' : 'none'}
                  flexDirection="column"
                  position="absolute"
                  py="2"
                  w="70vw"
                  zIndex="99999"
                >
                  {Object.entries(rpclist).map(([key, data]) => (
                    <HStack key={key} justifyContent="space-between" px="2" w="100%">
                      <Flex
                        _hover={{ bg: 'blue.100', cursor: 'pointer' }}
                        alignItems="center"
                        justifyContent="space-between"
                        px="2"
                        py="1"
                        w="100%"
                        onClick={() => {
                          switchPoint(key);
                        }}
                      >
                        <Heading color="gray.500" fontWeight="normal" size="xs">
                          {data.simpleName}
                        </Heading>
                        <Flex alignItems="center">
                          <Heading color="gray.500" fontWeight="normal" size="xs">
                            {displayCurrentRpc(responseTimeList, key)}
                          </Heading>
                        </Flex>
                      </Flex>
                    </HStack>
                  ))}
                </Box>
              </Center>
            </Box>
          </Flex>
        </Box>
      ) : (
        <Box bottom="0" position="fixed" right="8" zIndex="99998">
          <Flex alignItems="end">
            <Box
              position="relative"
              pt="3"
              onMouseEnter={() => {
                setHover(true);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
            >
              <Flex
                alignItems="center"
                bg="white"
                borderRadius="md"
                boxShadow="0px 0px 10px 10px rgba(0, 0, 0, 0.15)"
                cursor="pointer"
                height="25px"
                justifyContent="space-between"
                maxWidth={maxWidth}
                minWidth={minWidth}
                px="2"
              >
                <Flex alignItems="center" w="2/3">
                  <Heading
                    isTruncated
                    color="gray.500"
                    cursor="pointer"
                    fontWeight="normal"
                    pr="3"
                    size="xs"
                  >
                    {rpclist[currentEndPoint].simpleName}
                  </Heading>
                </Flex>
                <Flex alignItems="center">
                  <Heading color="gray.500" fontWeight="normal" size="xs">
                    {displayCurrentRpc(responseTimeList, currentEndPoint)}
                  </Heading>
                  <IconButton
                    aria-label="Expand"
                    color="primaryText"
                    icon={<ChevronDownIcon />}
                    transform={hover ? 'rotate(180deg)' : 'rotate(0)'}
                    variant="ghost"
                  />
                </Flex>
              </Flex>
              <Box
                bg="white"
                borderRadius="md"
                bottom="8"
                boxShadow="0px 0px 10px 10px rgba(0, 0, 0, 0.15)"
                display={hover ? 'flex' : 'none'}
                flexDirection="column"
                position="absolute"
                py="2"
                w="full"
                zIndex="99999"
              >
                {Object.entries(rpclist).map(([key, data]) => (
                  <Flex
                    key={key}
                    _hover={{ bg: 'blue.100', cursor: 'pointer' }}
                    alignItems="center"
                    bg={currentEndPoint === key ? 'navHighLightBg' : ''}
                    color="primaryText"
                    justifyContent="space-between"
                    maxWidth={maxWidth}
                    minWidth={minWidth}
                    px="2"
                    py="1"
                    onClick={() => {
                      switchPoint(key);
                    }}
                  >
                    <Heading color="gray.500" fontWeight="normal" size="xs">
                      {data.simpleName}
                    </Heading>
                    <Flex alignItems="center">
                      <Heading color="gray.500" fontWeight="normal" size="xs">
                        {displayCurrentRpc(responseTimeList, key)}
                      </Heading>
                    </Flex>
                  </Flex>
                ))}
              </Box>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};

const switchPoint = (chooseEndPoint: string) => {
  localStorage.setItem('endPoint', chooseEndPoint);
  window.location.reload();
};

const displayCurrentRpc = (responseTimeList, key) => {
  if (responseTimeList[key] === -1) {
    return (
      <Flex alignItems="center">
        <CloseIcon color="red.500" />
        <Text color="red.500" fontSize="xs" ml="1.5" mr="2.5">
          time out
        </Text>
      </Flex>
    );
  } else if (responseTimeList[key]) {
    return (
      <Flex alignItems="center">
        <CheckIcon color="green.500" />
        <Text color="primaryText" fontSize="xs" ml="1.5" mr="2.5">
          {responseTimeList[key]}ms
        </Text>
      </Flex>
    );
  } else {
    return null;
  }
};

async function ping(url: string, key: string): Promise<number> {
  const rpclist = getExtendConfig().RPC_LIST;
  const start = new Date().getTime();

  const businessRequest = fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'dontcare',
      method: 'gas_price',
      params: [null],
    }),
  });

  const timeoutPromise = new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      reject(Error('time out'));
    }, 8000);
  });

  const responseTime = await Promise.race([businessRequest, timeoutPromise])
    .then(() => {
      const end = new Date().getTime();
      return end - start;
    })
    .catch(async (error) => {
      if (error.message === 'time out') {
        return -1;
      } else {
        const currentRpc = localStorage.getItem('endPoint') || 'defaultRpc';
        if (currentRpc !== key) {
          return -1;
        } else {
          const availableRpc = Object.keys(rpclist).find((item) => item !== key) || 'defaultRpc';
          let reloadedTimes = Number(localStorage.getItem('rpc_reload_number') || 0);

          setTimeout(() => {
            reloadedTimes += 1;
            if (reloadedTimes > MAXELOADTIMES) {
              localStorage.setItem('endPoint', 'defaultRpc');
              localStorage.setItem('rpc_reload_number', '');
            } else {
              localStorage.setItem('endPoint', availableRpc);
              window.location.reload();
              localStorage.setItem('rpc_reload_number', reloadedTimes.toString());
            }
          }, 1000);

          return -1;
        }
      }
    });

  return responseTime;
}

export default RpcList;
