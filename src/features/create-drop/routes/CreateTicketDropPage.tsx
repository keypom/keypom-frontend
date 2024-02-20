import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { type IFlowPage } from '@/types/common';
import { CreateTicketDropForm } from '@/features/create-drop/components/ticket/CreateTicketDropForm';
import { CreateTicketDropWidget } from '@/features/create-drop/components/ticket/CreateTicketDropWidget';
import { CreateTicketDropSummary } from '@/features/create-drop/components/ticket/CreateTicketDropSummary';

const flowPages: IFlowPage[] = [
  {
    name: 'form',
    description: 'Enter the details for your new Ticket Drop',
    component: <CreateTicketDropForm />,
  },
  {
    name: 'summary',
    description: 'Let’s make sure all your details are correct',
    component: <CreateTicketDropSummary />,
  },
];

const breadcrumbs: IBreadcrumbItem[] = [
  {
    name: 'My drops',
    href: '/drops',
  },
  {
    name: 'New Ticket Drop',
    href: '/drops/ticket/new',
  },
];

export default function NewTicketDrop() {
  return <CreateTicketDropWidget />;
}
