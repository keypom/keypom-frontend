export interface IFlowPage {
  name: string;
  description: string;
  component: React.ReactNode; // forms, summary. etc
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
