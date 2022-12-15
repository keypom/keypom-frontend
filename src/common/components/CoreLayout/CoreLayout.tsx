import { PropsWithChildren } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Navbar } from "@/common/components/Navbar";
import { Footer } from "@/common/components/Footer";

interface CoreLayoutProps {}

export const CoreLayout = ({
  children,
}: PropsWithChildren<CoreLayoutProps>) => {
  const layoutBg =
    "url(.png), linear-gradient(180deg, rgba(239, 250, 253, 0.4) 0%, rgba(239, 250, 253, 0.6) 27.41%), #FFFFFF;";
  return (
    <Flex
      minH="100vh"
      flexDir="column"
      bg={layoutBg}
      bgBlendMode="overlay, normal, normal"
    >
      <Navbar />
      <Box w="full" px="5" maxW="62.125rem" mx="auto" as="main" flex="1">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};
