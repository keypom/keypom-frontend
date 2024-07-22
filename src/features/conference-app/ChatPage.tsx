import {
  Box,
  Center,
  Flex,
  VStack,
  Skeleton,
  Image,
  Text,
  HStack,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { LockIcon } from '@chakra-ui/icons';

import { useConferenceContext } from '@/contexts/ConferenceContext';
import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { CameraIcon } from '@/components/Icons/CameraIcon';
import { SendIcon } from '@/components/Icons/SendIcon';

export interface User {
  username: string;
  profileImage: string;
}

export interface Message {
  content: string;
  timestamp: Date;
  incoming: boolean;
}

const ChatPage: React.FC = () => {
  const { eventInfo, isLoading } = useConferenceContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const initialMessages: Message[] = [
      {
        content: 'This consensus demo is pretty awesome eh?',
        timestamp: new Date(),
        incoming: true,
      },
      {
        content: "Absolutely! I'm super excited to scan all these QR codes",
        timestamp: new Date(),
        incoming: false,
      },
    ];
    setMessages(initialMessages);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <Center h="78vh">
      <VStack
        gap={{ base: '16px', md: '24px', lg: '32px' }}
        overflowY="auto"
        pt="14"
        spacing="4"
        w={{ base: '90vw', md: '90%', lg: '80%' }}
      >
        <IconBox
          bg='border.box
          h="full"
          icon={
            <Skeleton isLoaded={!isLoading}>
              <Image
                borderRadius="full"
                height={{ base: '14', md: '12' }}
                src={`/assets/demos/consensus/consensus_logo.png`}
                width={{ base: '20', md: '12' }}
              />
            </Skeleton>
          }
          iconBg={'event.iconBg'}
          iconBorder={'event.iconBorder'}
          minW={{ base: '90vw', md: '345px' }}
          p="0"
          pb="0"
          w="full"
        >
          <Box>
            <BoxWithShape
              bg={eventInfo.styles.h1.color}
              borderTopRadius="6xl"
              showNotch={false}
              w="full"
            >
              {isLoading ? (
                <Skeleton height="200px" width="full" />
              ) : (
                <Flex
                  align="center"
                  flexDir="column"
                  h="full"
                  pb={{ base: '2', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '10', md: '8' }}
                >
                  <HStack h="min-content" justify="space-between" pb="4" spacing="4" w="100%">
                    <HStack spacing="3">
                      <Skeleton isLoaded={!isLoading}>
                        <Image
                          borderRadius="12px"
                          height="40px"
                          src={`/assets/demos/consensus/illia_profile.png`}
                          width="40px"
                        />
                      </Skeleton>
                      <VStack align="start" h="40px" spacing="0">
                        <Text
                          color="white"
                          fontFamily={eventInfo.styles.h1.fontFamily}
                          fontSize="md"
                          fontWeight={eventInfo.styles.h1.fontWeight}
                        >
                          Illia Polosukhin
                        </Text>
                        <Text
                          color="white"
                          fontFamily={eventInfo.styles.h3.fontFamily}
                          fontSize="xs"
                          fontWeight={eventInfo.styles.h3.fontWeight}
                        >
                          Online
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                </Flex>
              )}
            </BoxWithShape>

            <Flex
              flexDir="column"
              h="calc(78vh - 170px)"
              justifyContent="space-between"
              p="6"
              w="full"
            >
              <VStack h="full" overflowY="auto" spacing={8} w="full">
                <VStack align="stretch" flex="1" spacing="8" w="full">
                  {messages.map((message, index) => (
                    <Flex
                      key={index}
                      align="center"
                      justify={message.incoming ? 'flex-start' : 'flex-end'}
                      w="full"
                    >
                      {message.incoming && (
                        <Image
                          alignSelf="center"
                          borderRadius="8px"
                          height="30px"
                          mr="3"
                          src={`/assets/demos/consensus/illia_profile.png`}
                          width="30px"
                        />
                      )}
                      <VStack align="left" spacing="0" textAlign="left" w="80%">
                        <Box
                          bg={message.incoming ? 'gray.100' : 'blue.100'}
                          borderRadius="md"
                          maxW="100%"
                          p="3"
                          shadow="md"
                        >
                          <Text fontSize="sm">{message.content}</Text>
                        </Box>
                        <Text
                          alignSelf={message.incoming ? 'start' : 'end'}
                          color="gray.500"
                          fontSize="xs"
                          mt="1"
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </VStack>
                      {!message.incoming && (
                        <Image
                          alignSelf="center"
                          borderRadius="8px"
                          height="30px"
                          ml="3"
                          src={`/assets/demos/consensus/mystery_girl.jpg`}
                          width="30px"
                        />
                      )}
                    </Flex>
                  ))}
                </VStack>
              </VStack>

              <VStack align="stretch" bg="white" borderRadius="md" position="relative" w="full">
                <HStack
                  bg="blue.100"
                  borderRadius="12px"
                  position="relative"
                  px="2"
                  py="1"
                  spacing="1"
                  w="full"
                >
                  <IconButton
                    aria-label="Attach"
                    borderRadius="full"
                    boxSize="40px"
                    icon={
                      <CameraIcon
                        color={eventInfo.styles.h1.color}
                        h="24px"
                        pt="0.5"
                        strokeWidth="2"
                      />
                    }
                    variant="ghost"
                  />
                  <Input
                    isDisabled
                    _placeholder={{ color: eventInfo.styles.h3.color }}
                    borderRadius="full"
                    color={eventInfo.styles.h3.color}
                    fontFamily={eventInfo.styles.h3.fontFamily}
                    fontWeight={eventInfo.styles.h3.fontWeight}
                    placeholder="Type Your Message"
                    variant="unstyled"
                  />
                  <IconButton
                    aria-label="Send"
                    backgroundColor={eventInfo.styles.h1.color}
                    borderRadius="12px"
                    boxSize="40px"
                    icon={<SendIcon color="white" h="20px" strokeWidth="2" />}
                  />
                </HStack>
                <Flex
                  align="center"
                  bg="rgba(255, 255, 255, 0.7)"
                  borderRadius="md"
                  h="full"
                  justify="center"
                  left="0"
                  position="absolute"
                  top="0"
                  w="full"
                  zIndex="1"
                >
                  <LockIcon mr="2" />
                  <Text fontWeight="bold">Coming Soon</Text>
                </Flex>
              </VStack>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default ChatPage;
