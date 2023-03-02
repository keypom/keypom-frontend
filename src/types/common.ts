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
  wallet: string;
}
