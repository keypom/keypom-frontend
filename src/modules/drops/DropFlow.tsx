// Generic drop flow
// Moves one component to one another

import { useState } from 'react';

import { DropLayout } from './DropLayout';

export interface FlowPage {
  name: string;
  description: string;
  component: React.ReactNode; // forms, summary. etc
}

interface DropFlowProps {
  flow: FlowPage[];
}

export const DropFlow = ({ flow }: DropFlowProps) => {
  const [currentPage, setPage] = useState(0);

  return <DropLayout>Form</DropLayout>;
};
