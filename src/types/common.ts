import type React from 'react';

export interface IFlowPage {
  name: string;
  description: string;
  component: React.ReactNode; // forms, summary. etc
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface IWalletOption {
  name: string;
  title: string;
}

export interface IToken {
  amount: string;
  symbol: string;
}

export interface TokenAsset {
  icon: string;
  value: string;
  symbol: string;
}

// {
//   name: '',
//   description: '',
//   salesStartDate: '2023-03-31T02:00',
//   salesEndDate: '2023-03-31T02:02',
//   nearPricePerTicket: '',
//   numberOfTickets: '',
// }

export interface ITicketData {
  name: string;
  description: string;
  salesStartDate: string;
  salesEndDate: string;
  nearPricePerTicket: number | string;
  numberOfTickets: number;
}
