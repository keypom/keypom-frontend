import { PageHead } from "@/common/components/PageHead";
import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box mt={{ base: 6, md: 14 }}>
      <PageHead description="Home page description" name="Home" />
      Hello World
    </Box>
  );
}
