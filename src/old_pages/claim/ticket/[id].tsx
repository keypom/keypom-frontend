import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IFlowPage } from '@/common/types';

import { ClaimFormContextProvider } from '@/modules/claim/ClaimFormContext';
import { ClaimTicketFlowProvider } from '@/modules/claim/ticket/ClaimTicketFlowContext';
import { ClaimTicketFormFlow } from '@/modules/claim/ticket/ClaimTicketFormFlow';
import { ClaimTicketSummaryFlow } from '@/modules/claim/ticket/ClaimTicketSummaryFlow';
import { ClaimTicketFlow } from '@/modules/claim/ticket/ClaimTicketFlow';

const flowPages: IFlowPage[] = [
  {
    name: 'form',
    description: 'Enter the details to receive your ticket',
    component: <ClaimTicketFormFlow />,
  },
  {
    name: 'summary',
    description: 'Your ticket summary',
    component: <ClaimTicketSummaryFlow />,
  },
];

const YourTicketPage = () => {
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <PageHead
        removeTitleAppend
        description="Page detailing all your ticket."
        name="Your ticket"
      />
      <ClaimFormContextProvider>
        <ClaimTicketFlowProvider flowPages={flowPages}>
          <ClaimTicketFlow />
        </ClaimTicketFlowProvider>
      </ClaimFormContextProvider>
    </Box>
  );
};

export default YourTicketPage;
