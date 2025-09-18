export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: 'treasury' | 'governance' | 'technical' | 'roles';
  icon: string;
  color: string;
  fields: ProposalField[];
}

export interface ProposalField {
  id: string;
  name: string;
  type: 'address' | 'amount' | 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface Action {
  id?: string;
  templateId: string;
  templateName: string;
  parameters: Record<string, any>;
  encodedCalldata?: string;
  target?: string;
  value?: string;
}

export interface ProposalData {
  title: string;
  description: string;
  actions: Action[];
  totalValue: string;
}

export interface WalletState {
  address?: string;
  chainId?: number;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  provider?: any;
}