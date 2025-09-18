import React, { useState } from 'react';
import { Plus, Trash2, ChevronLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { ProposalTemplate, Action, ProposalField } from '../types/proposal';

interface ProposalBuilderProps {
  template: ProposalTemplate | null;
  actions: Action[];
  proposalTitle: string;
  proposalDescription: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onAddAction: (action: Action) => void;
  onRemoveAction: (actionId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProposalBuilder: React.FC<ProposalBuilderProps> = ({
  template,
  actions,
  proposalTitle,
  proposalDescription,
  onTitleChange,
  onDescriptionChange,
  onAddAction,
  onRemoveAction,
  onNext,
  onBack
}) => {
  const [currentParameters, setCurrentParameters] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: ProposalField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.name} is required`;
    }

    if (field.type === 'address' && value) {
      if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
        return 'Invalid address format';
      }
    }

    if (field.type === 'amount' && value) {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        return 'Amount must be a positive number';
      }
    }

    return null;
  };

  const handleParameterChange = (fieldId: string, value: any) => {
    setCurrentParameters(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const handleAddAction = () => {
    if (!template) return;

    const newErrors: Record<string, string> = {};
    
    template.fields.forEach(field => {
      const error = validateField(field, currentParameters[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const action: Action = {
      templateId: template.id,
      templateName: template.name,
      parameters: { ...currentParameters }
    };

    onAddAction(action);
    setCurrentParameters({});
    setErrors({});
  };

  const canProceed = proposalTitle.trim() !== '' && proposalDescription.trim() !== '' && actions.length > 0;

  if (!template) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">Build Your Proposal</h2>
        <p className="text-black/80">Configure the details and actions for your governance proposal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Proposal Details */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white-400 to-white-500 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-black mb-4">✨ Proposal Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black/90 mb-2">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  value={proposalTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Give your proposal a clear, descriptive title"
                  className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-black/30 rounded-2xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200 text-black placeholder-black/70 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black/90 mb-2">
                  Description *
                </label>
                <textarea
                  value={proposalDescription}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="Explain the purpose and rationale for this proposal"
                  rows={4}
                  className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-black/30 rounded-2xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200 text-black placeholder-black/70 shadow-inner resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Form */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-black mb-4">⚡ Add Action: {template.name}</h3>
            
            <div className="space-y-4">
              {template.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-black/90 mb-2">
                    {field.name} {field.required && '*'}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={currentParameters[field.id] || ''}
                      onChange={(e) => handleParameterChange(field.id, e.target.value)}
                      className={`w-full px-4 py-3 bg-black/20 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200 text-black shadow-inner ${
                        errors[field.id] ? 'border-red-500' : 'border-black/30'
                      }`}
                    >
                      <option value="">Select {field.name}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'amount' ? 'number' : 'text'}
                      value={currentParameters[field.id] || ''}
                      onChange={(e) => handleParameterChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3 bg-black/20 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200 text-black placeholder-black/70 shadow-inner ${
                        errors[field.id] ? 'border-red-500' : 'border-black/30'
                      }`}
                    />
                  )}
                  
                  {errors[field.id] && (
                    <div className="flex items-center space-x-1 mt-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{errors[field.id]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddAction}
              className="mt-6 flex items-center space-x-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 text-black px-6 py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Action</span>
            </button>
          </div>
        </div>

        {/* Right Column - Actions List */}
        <div>
          <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">
              Proposal Actions ({actions.length})
            </h3>

            {actions.length === 0 ? (
              <div className="text-center py-8 text-yellow-400/70">
                <div className="w-16 h-16 bg-yellow-400/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <p>No actions added yet</p>
                <p className="text-sm">Add actions using the form on the left</p>
              </div>
            ) : (
              <div className="space-y-3">
                {actions.map((action, index) => (
                  <div key={action.id} className="bg-yellow-400/10 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-yellow-400">
                            Action {index + 1}: {action.templateName}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-yellow-400/80">
                          {Object.entries(action.parameters).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="capitalize font-medium w-20">{key}:</span>
                              <span className="break-all">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => action.id && onRemoveAction(action.id)}
                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-black/20">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-black/80 hover:text-black px-4 py-2 rounded-2xl hover:bg-black/10 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Templates</span>
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center space-x-2 px-8 py-3 rounded-2xl transition-all duration-200 shadow-lg ${
            canProceed
              ? 'bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-yellow-400 hover:shadow-xl transform hover:scale-105'
              : 'bg-black/20 text-black/50 cursor-not-allowed'
          }`}
        >
          <span>Review Proposal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProposalBuilder;