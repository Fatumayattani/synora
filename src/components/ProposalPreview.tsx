import React, { useState } from 'react';
import { ChevronLeft, Send, Eye, Code, CheckCircle, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { ProposalTemplate, Action } from '../types/proposal';
import { ethers } from 'ethers';
import { 
  createProposal, 
  markProposalAsExecuted, 
  generateEncodedAction, 
  getExplorerUrl,
  formatAddress 
} from '../utils/contractUtils';

interface ProposalPreviewProps {
  template: ProposalTemplate | null;
  title: string;
  description: string;
  actions: Action[];
  onBack: () => void;
  isConnected: boolean;
}

const ProposalPreview: React.FC<ProposalPreviewProps> = ({
  template,
  title,
  description,
  actions,
  onBack,
  isConnected
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<'success' | 'error' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    proposalId?: bigint;
    transactionHash?: string;
    error?: string;
  } | null>(null);
  const [isMarkingExecuted, setIsMarkingExecuted] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSimulationResult('success');
    setIsSimulating(false);
  };

  const handleSubmit = async () => {
    if (!isConnected || !walletState.provider || !walletState.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      // Create ethers provider and signer
      const provider = new ethers.BrowserProvider(walletState.provider);
      const signer = await provider.getSigner();

      // Generate encoded action from the first action (simplified for demo)
      let encodedAction = '0x';
      if (actions.length > 0) {
        encodedAction = generateEncodedAction(actions[0].templateId, actions[0].parameters);
      }

      // Create proposal on-chain
      const result = await createProposal(signer, {
        title,
        description,
        encodedAction
      });

      setSubmissionResult({
        success: true,
        proposalId: result.proposalId,
        transactionHash: result.transactionHash
      });

    } catch (error: any) {
      console.error('Proposal submission failed:', error);
      setSubmissionResult({
        success: false,
        error: error.message || 'Failed to submit proposal'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsExecuted = async () => {
    if (!submissionResult?.proposalId || !walletState.provider) {
      return;
    }

    setIsMarkingExecuted(true);

    try {
      const provider = new ethers.BrowserProvider(walletState.provider);
      const signer = await provider.getSigner();

      const txHash = await markProposalAsExecuted(signer, submissionResult.proposalId);
      
      alert(`Proposal marked as executed! Transaction: ${txHash}`);
      
      // Update submission result to reflect executed status
      setSubmissionResult(prev => prev ? { ...prev, executed: true } : null);

    } catch (error: any) {
      console.error('Failed to mark as executed:', error);
      alert(`Failed to mark as executed: ${error.message}`);
    } finally {
      setIsMarkingExecuted(false);
    }
  };

  const getCalldata = (action: Action): string => {
    return generateEncodedAction(action.templateId, action.parameters);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">Review & Submit Proposal</h2>
        <p className="text-black/80">Review your proposal details and submit to the DAO</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposal Overview */}
          <div className="bg-gradient-to-br from-white-400 to-white-500 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-black mb-4">📋 Proposal Overview</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-black/90">Title</label>
                <p className="text-black mt-1 font-medium">{title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-black/90">Description</label>
                <p className="text-black mt-1 whitespace-pre-wrap">{description}</p>
              </div>
            </div>
          </div>

          {/* Actions List */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-black mb-4">
              Actions ({actions.length})
            </h3>
            
            <div className="space-y-4">
              {actions.map((action, index) => (
                <div key={action.id} className="bg-black/10 backdrop-blur-sm border border-black/20 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-black">
                      Action {index + 1}: {action.templateName}
                    </h4>
                    <button className="text-black/60 hover:text-black">
                      <Code className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(action.parameters).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-black/80 capitalize">{key}:</span>
                        <p className="text-black font-mono break-all">{value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-black/20">
                    <div className="text-sm">
                      <span className="text-black/80">Calldata:</span>
                      <p className="text-black font-mono text-xs break-all mt-1">
                        {getCalldata(action)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Simulation */}
          <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">🔮 Simulation</h3>
            
            <div className="space-y-4">
              <p className="text-sm text-yellow-400/90">
                Test your proposal execution on Somnia testnet before submitting
              </p>
              
              <button
                onClick={handleSimulate}
                disabled={isSimulating}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-200 shadow-lg ${
                  isSimulating
                    ? 'bg-yellow-400/20 text-yellow-400/50'
                    : 'bg-yellow-400/20 backdrop-blur-sm hover:bg-yellow-400/30 text-yellow-400 hover:shadow-xl transform hover:scale-105'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{isSimulating ? 'Simulating...' : 'Simulate Execution'}</span>
              </button>
              
              {simulationResult && (
                <div className={`flex items-center space-x-2 p-3 rounded-2xl ${
                  simulationResult === 'success' 
                    ? 'bg-green-500/20 text-yellow-400 border border-green-400/30'
                    : 'bg-red-500/20 text-yellow-400 border border-red-400/30'
                }`}>
                  {simulationResult === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {simulationResult === 'success' 
                      ? 'Simulation successful'
                      : 'Simulation failed'
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submission */}
          <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">🚀 Submit Proposal</h3>
            
            <div className="space-y-4">
              <div className="text-sm text-yellow-400/90 space-y-2">
                <p>• Gas estimation: ~150,000</p>
                <p>• Network: Somnia Testnet</p>
                <p>• Voting period: 7 days</p>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={!isConnected || isSubmitting}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-200 shadow-lg ${
                  !isConnected
                    ? 'bg-yellow-400/20 text-yellow-400/50 cursor-not-allowed'
                    : isSubmitting
                    ? 'bg-yellow-400/30 text-yellow-400 cursor-wait'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>
                  {!isConnected 
                    ? 'Connect Wallet to Submit'
                    : isSubmitting 
                    ? 'Submitting...'
                    : 'Submit Proposal'
                  }
                </span>
              </button>
              
              {!isConnected && (
                <p className="text-xs text-yellow-400/70 text-center">
                  Connect your wallet to submit the proposal
                </p>
              )}

              {/* Submission Result */}
              {submissionResult && (
                <div className={`p-4 rounded-2xl border ${
                  submissionResult.success 
                    ? 'bg-green-500/20 border-green-400/30 text-yellow-400'
                    : 'bg-red-500/20 border-red-400/30 text-yellow-400'
                }`}>
                  {submissionResult.success ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Proposal Created!</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>Proposal ID: #{submissionResult.proposalId?.toString()}</p>
                        <p>Status: Created</p>
                        {submissionResult.transactionHash && (
                          <a 
                            href={getExplorerUrl(submissionResult.transactionHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-400/80 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View Transaction</span>
                          </a>
                        )}
                      </div>
                      
                      {/* Mark as Executed Button */}
                      <button
                        onClick={handleMarkAsExecuted}
                        disabled={isMarkingExecuted}
                        className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 rounded-xl transition-all duration-200 text-sm"
                      >
                        {isMarkingExecuted ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        <span>{isMarkingExecuted ? 'Marking...' : 'Mark as Executed'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Submission Failed</p>
                        <p className="text-sm">{submissionResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">📚 Resources</h3>
            
            <div className="space-y-3 text-sm">
              <a href="#" className="flex items-center space-x-2 text-yellow-400/90 hover:text-yellow-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Governance Documentation</span>
              </a>
              
              <a href="#" className="flex items-center space-x-2 text-yellow-400/90 hover:text-yellow-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Somnia Explorer</span>
              </a>
              
              <a href="#" className="flex items-center space-x-2 text-yellow-400/90 hover:text-yellow-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Community Forum</span>
              </a>
            </div>
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
          <span>Back to Builder</span>
        </button>
      </div>
    </div>
  );
};

export default ProposalPreview;