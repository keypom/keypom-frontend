import { Box } from '@chakra-ui/react';

import { type IFlowPage } from '@/types/common';

import { ClaimFormContextProvider } from '../../components/ClaimFormContext';
import { ClaimTicketFlowProvider } from '../../components/ticket/ClaimTicketFlowContext';
import { ClaimTicketFormFlow } from '../../components/ticket/ClaimTicketFormFlow';
import { ClaimTicketSummaryFlow } from '../../components/ticket/ClaimTicketSummaryFlow';
import { ClaimTicketFlow } from '../../components/ticket/ClaimTicketFlow';

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
      <ClaimFormContextProvider>
        <ClaimTicketFlowProvider flowPages={flowPages}>
          <ClaimTicketFlow />
        </ClaimTicketFlowProvider>
      </ClaimFormContextProvider>
    </Box>
  );
};

export default YourTicketPage;
