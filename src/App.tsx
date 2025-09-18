import React, { useState } from 'react';
import { Wallet, FileText, Settings, Users, ArrowRight, Plus, Trash2, Eye, Send, Home } from 'lucide-react';
import LandingPage from './components/LandingPage';
import ProposalTemplates from './components/ProposalTemplates';
import ProposalBuilder from './components/ProposalBuilder';
import ProposalPreview from './components/ProposalPreview';
import WalletConnection from './components/WalletConnection';
import { Action, ProposalTemplate } from './types/proposal';
import { WalletState } from './types/wallet';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplate | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isCorrectNetwork: false
  });

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleBackToHome = () => {
    setShowLanding(true);
    setCurrentStep(0);
    setSelectedTemplate(null);
    setActions([]);
    setProposalTitle('');
    setProposalDescription('');
    setWalletState({ isConnected: false, isCorrectNetwork: false });
  };

  const steps = [
    { id: 0, title: 'Select Template', icon: FileText },
    { id: 1, title: 'Build Proposal', icon: Settings },
    { id: 2, title: 'Preview & Submit', icon: Send }
  ];

  const handleTemplateSelect = (template: ProposalTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep(1);
  };

  const handleAddAction = (action: Action) => {
    setActions([...actions, { ...action, id: Date.now().toString() }]);
  };

  const handleRemoveAction = (actionId: string) => {
    setActions(actions.filter(action => action.id !== actionId));
  };

  const handleNextStep = () => {
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const handlePreviousStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-black/30 shadow-2xl mx-4 mt-4 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">Governance Proposal Generator</h1>
                <p className="text-sm text-black/80">Powered by Somnia</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 text-black/80 hover:text-black px-4 py-2 rounded-2xl hover:bg-black/20 transition-all duration-200 backdrop-blur-sm"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <WalletConnection 
                walletState={walletState} 
                onWalletStateChange={setWalletState} 
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-3 ${isActive ? 'text-black' : isCompleted ? 'text-black' : 'text-black/60'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg ${
                      isActive 
                        ? 'bg-gradient-to-br from-black to-gray-800' 
                        : isCompleted 
                        ? 'bg-gradient-to-br from-yellow-600 to-yellow-700' 
                        : 'bg-black/20 backdrop-blur-sm'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-400' : isCompleted ? 'text-black' : 'text-black/60'}`} />
                    </div>
                    <span className={`font-semibold ${isActive ? 'text-black' : isCompleted ? 'text-black' : 'text-black/60'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className={`w-5 h-5 mx-4 ${isCompleted ? 'text-black' : 'text-black/40'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-black/10 backdrop-blur-md rounded-3xl shadow-2xl border border-black/20">
          {currentStep === 0 && (
            <ProposalTemplates onTemplateSelect={handleTemplateSelect} />
          )}
          
          {currentStep === 1 && selectedTemplate && (
            <ProposalBuilder 
              template={selectedTemplate}
              actions={actions}
              proposalTitle={proposalTitle}
              proposalDescription={proposalDescription}
              onTitleChange={setProposalTitle}
              onDescriptionChange={setProposalDescription}
              onAddAction={handleAddAction}
              onRemoveAction={handleRemoveAction}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
            />
          )}
          
          {currentStep === 2 && (
            <ProposalPreview
              template={selectedTemplate}
              title={proposalTitle}
              description={proposalDescription}
              actions={actions}
              onBack={handlePreviousStep}
              isConnected={walletState.isConnected}
            />
          )}
        </div>

        {/* Features Grid */}
        {currentStep === 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Smart Templates',
                description: 'Pre-built templates for common governance actions',
                icon: FileText,
                color: 'text-yellow-400 bg-gradient-to-br from-black to-gray-800'
              },
              {
                title: 'No-Code Builder',
                description: 'Intuitive interface for non-technical users',
                icon: Settings,
                color: 'text-yellow-400 bg-gradient-to-br from-gray-800 to-black'
              },
              {
                title: 'Somnia Integration',
                description: 'Native support for Somnia blockchain',
                icon: Wallet,
                color: 'text-black bg-gradient-to-br from-yellow-400 to-yellow-500'
              },
              {
                title: 'Error Prevention',
                description: 'Built-in validation prevents common mistakes',
                icon: Plus,
                color: 'text-yellow-400 bg-gradient-to-br from-gray-700 to-black'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-black/10 backdrop-blur-md p-6 rounded-3xl border border-black/20 hover:shadow-2xl transition-all duration-200 hover:scale-105">
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-black mb-2">{feature.title}</h3>
                  <p className="text-sm text-black/80">{feature.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;