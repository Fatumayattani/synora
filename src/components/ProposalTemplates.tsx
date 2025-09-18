import React from 'react';
import { ArrowRight, Coins, Settings, Code, Users } from 'lucide-react';
import { ProposalTemplate } from '../types/proposal';

interface ProposalTemplatesProps {
  onTemplateSelect: (template: ProposalTemplate) => void;
}

const templates: ProposalTemplate[] = [
  {
    id: 'treasury-transfer',
    name: 'Treasury Transfer',
    description: 'Transfer tokens from DAO treasury to a recipient',
    category: 'treasury',
    icon: 'Coins',
    color: 'text-emerald-600 bg-emerald-100 border-emerald-200',
    fields: [
      {
        id: 'recipient',
        name: 'Recipient Address',
        type: 'address',
        required: true,
        placeholder: '0x...'
      },
      {
        id: 'token',
        name: 'Token Contract',
        type: 'address',
        required: true,
        placeholder: '0x... (USDC, DAI, etc.)'
      },
      {
        id: 'amount',
        name: 'Amount',
        type: 'amount',
        required: true,
        placeholder: '1000.00'
      }
    ]
  },
  {
    id: 'parameter-change',
    name: 'Parameter Update',
    description: 'Update protocol parameters like fees, rates, or limits',
    category: 'governance',
    icon: 'Settings',
    color: 'text-indigo-600 bg-indigo-100 border-indigo-200',
    fields: [
      {
        id: 'target',
        name: 'Target Contract',
        type: 'address',
        required: true,
        placeholder: '0x...'
      },
      {
        id: 'parameter',
        name: 'Parameter Name',
        type: 'string',
        required: true,
        placeholder: 'interest_rate'
      },
      {
        id: 'value',
        name: 'New Value',
        type: 'string',
        required: true,
        placeholder: '500 (for 5%)'
      }
    ]
  },
  {
    id: 'contract-upgrade',
    name: 'Contract Upgrade',
    description: 'Upgrade a proxy contract to a new implementation',
    category: 'technical',
    icon: 'Code',
    color: 'text-black-600 bg-white-100 border-yellow-200',
    fields: [
      {
        id: 'proxy',
        name: 'Proxy Contract',
        type: 'address',
        required: true,
        placeholder: '0x...'
      },
      {
        id: 'implementation',
        name: 'New Implementation',
        type: 'address',
        required: true,
        placeholder: '0x...'
      },
      {
        id: 'initData',
        name: 'Initialization Data',
        type: 'string',
        required: false,
        placeholder: '0x... (optional)'
      }
    ]
  },
  {
    id: 'role-management',
    name: 'Role Management',
    description: 'Grant or revoke admin roles and permissions',
    category: 'roles',
    icon: 'Users',
    color: 'text-orange-600 bg-orange-100 border-orange-200',
    fields: [
      {
        id: 'target',
        name: 'Target Contract',
        type: 'address',
        required: true,
        placeholder: '0x...'
      },
      {
        id: 'user',
        name: 'User Address',
        type: 'address',
        required: true,
        placeholder: '0x...'
      },
      {
        id: 'action',
        name: 'Action',
        type: 'select',
        required: true,
        options: ['Grant Role', 'Revoke Role']
      },
      {
        id: 'role',
        name: 'Role',
        type: 'select',
        required: true,
        options: ['ADMIN', 'MINTER', 'PAUSER', 'UPGRADER']
      }
    ]
  }
];

const ProposalTemplates: React.FC<ProposalTemplatesProps> = ({ onTemplateSelect }) => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Coins,
      Settings,
      Code,
      Users
    };
    return icons[iconName] || Settings;
  };

  const categoryLabels = {
    treasury: 'Treasury',
    governance: 'Governance',
    technical: 'Technical',
    roles: 'Access Control'
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, ProposalTemplate[]>);

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">Choose a Proposal Template</h2>
        <p className="text-black/80">Select from pre-built templates to create governance proposals quickly and accurately</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-black mb-4">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryTemplates.map((template) => {
                const Icon = getIcon(template.icon);
                return (
                  <div
                    key={template.id}
                    className="group cursor-pointer bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/20 hover:border-black/40 rounded-3xl p-6 transition-all duration-200 hover:shadow-2xl hover:scale-105"
                    onClick={() => onTemplateSelect(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-black to-gray-800 text-yellow-400 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-black mb-1">{template.name}</h4>
                          <p className="text-sm text-black/80 mb-3">{template.description}</p>
                          <div className="flex items-center text-sm text-black/60">
                            <span>{template.fields.length} parameters</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-black/60 group-hover:text-black transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalTemplates;