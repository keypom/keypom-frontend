// Generic drop flow
// Moves one component to one another

import { useState } from 'react';

import { IBreadcrumbItem } from '@/common/components/Breadcrumbs';

import { DropLayout } from './DropLayout';
import { FlowPage } from './types/types';

interface DropFlowProps {
  flow: FlowPage[];
  breadcrumbs: IBreadcrumbItem[];
}

// Flow controller component for navigating pages
export const DropFlow = ({ flow, breadcrumbs }: DropFlowProps) => {
  const [currentPage, setPage] = useState(0);

  return (
    <DropLayout breadcrumbs={breadcrumbs} description={flow[currentPage].description}>
      {flow[currentPage].component}
    </DropLayout>
  );
};
