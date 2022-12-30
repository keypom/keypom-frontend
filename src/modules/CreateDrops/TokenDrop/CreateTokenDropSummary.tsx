import { DropSummary } from '../DropSummary';

import { useCreateTokenDropContext } from './CreateTokenDropContext';

export const CreateTokenDropSummary = () => {
  const { getSummaryData } = useCreateTokenDropContext();
  const summaryData = getSummaryData();

  return <DropSummary summaryData={summaryData} />;
};
