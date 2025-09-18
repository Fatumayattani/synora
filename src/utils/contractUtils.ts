import ProposalFactoryABI from '../contracts/ProposalFactory.json';
import { ethers } from 'ethers';

// Contract configuration
export const PROPOSAL_FACTORY_ADDRESS = ProposalFactoryABI.address;
export const PROPOSAL_FACTORY_ABI = ProposalFactoryABI.abi;

// Proposal status enum
export enum ProposalStatus {
  Created = 0,
  Executed = 1
}

// TypeScript interfaces
export interface OnChainProposal {
  id: bigint;
  proposer: string;
  title: string;
  description: string;
  encodedAction: string;
  status: ProposalStatus;
  createdAt: bigint;
}

export interface CreateProposalParams {
  title: string;
  description: string;
  encodedAction: string;
}

/**
 * Get ProposalFactory contract instance
 */
export function getProposalFactoryContract(provider: ethers.Provider, signer?: ethers.Signer) {
  const contractProvider = signer || provider;
  return new ethers.Contract(PROPOSAL_FACTORY_ADDRESS, PROPOSAL_FACTORY_ABI, contractProvider);
}

/**
 * Create a new proposal on-chain
 */
export async function createProposal(
  signer: ethers.Signer,
  params: CreateProposalParams
): Promise<{ proposalId: bigint; transactionHash: string }> {
  try {
    const contract = getProposalFactoryContract(signer.provider!, signer);
    
    // Estimate gas
    const gasEstimate = await contract.createProposal.estimateGas(
      params.title,
      params.description,
      params.encodedAction
    );
    
    // Add 20% buffer to gas estimate
    const gasLimit = gasEstimate * 120n / 100n;
    
    // Send transaction
    const tx = await contract.createProposal(
      params.title,
      params.description,
      params.encodedAction,
      { gasLimit }
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Extract proposal ID from events
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'ProposalCreated';
      } catch {
        return false;
      }
    });
    
    if (!event) {
      throw new Error('ProposalCreated event not found in transaction receipt');
    }
    
    const parsedEvent = contract.interface.parseLog(event);
    const proposalId = parsedEvent?.args[0];
    
    return {
      proposalId,
      transactionHash: tx.hash
    };
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    throw new Error(`Failed to create proposal: ${error.message}`);
  }
}

/**
 * Mark a proposal as executed
 */
export async function markProposalAsExecuted(
  signer: ethers.Signer,
  proposalId: bigint
): Promise<string> {
  try {
    const contract = getProposalFactoryContract(signer.provider!, signer);
    
    // Estimate gas
    const gasEstimate = await contract.markAsExecuted.estimateGas(proposalId);
    const gasLimit = gasEstimate * 120n / 100n;
    
    // Send transaction
    const tx = await contract.markAsExecuted(proposalId, { gasLimit });
    
    // Wait for confirmation
    await tx.wait();
    
    return tx.hash;
  } catch (error: any) {
    console.error('Error marking proposal as executed:', error);
    throw new Error(`Failed to mark proposal as executed: ${error.message}`);
  }
}

/**
 * Get proposal by ID
 */
export async function getProposal(
  provider: ethers.Provider,
  proposalId: bigint
): Promise<OnChainProposal> {
  try {
    const contract = getProposalFactoryContract(provider);
    const proposal = await contract.getProposal(proposalId);
    
    return {
      id: proposal.id,
      proposer: proposal.proposer,
      title: proposal.title,
      description: proposal.description,
      encodedAction: proposal.encodedAction,
      status: proposal.status,
      createdAt: proposal.createdAt
    };
  } catch (error: any) {
    console.error('Error fetching proposal:', error);
    throw new Error(`Failed to fetch proposal: ${error.message}`);
  }
}

/**
 * Get proposals created by a specific address
 */
export async function getProposerProposals(
  provider: ethers.Provider,
  proposerAddress: string
): Promise<bigint[]> {
  try {
    const contract = getProposalFactoryContract(provider);
    const proposalIds = await contract.getProposerProposals(proposerAddress);
    return proposalIds;
  } catch (error: any) {
    console.error('Error fetching proposer proposals:', error);
    throw new Error(`Failed to fetch proposer proposals: ${error.message}`);
  }
}

/**
 * Get total proposal count
 */
export async function getProposalCount(provider: ethers.Provider): Promise<bigint> {
  try {
    const contract = getProposalFactoryContract(provider);
    return await contract.getProposalCount();
  } catch (error: any) {
    console.error('Error fetching proposal count:', error);
    throw new Error(`Failed to fetch proposal count: ${error.message}`);
  }
}

/**
 * Generate encoded action data for different proposal types
 */
export function generateEncodedAction(templateId: string, parameters: Record<string, any>): string {
  try {
    switch (templateId) {
      case 'treasury-transfer':
        // Encode ERC20 transfer function call
        const transferInterface = new ethers.Interface([
          'function transfer(address to, uint256 amount)'
        ]);
        return transferInterface.encodeFunctionData('transfer', [
          parameters.recipient,
          ethers.parseUnits(parameters.amount.toString(), 18) // Assuming 18 decimals
        ]);
        
      case 'parameter-change':
        // Encode parameter update function call
        const paramInterface = new ethers.Interface([
          'function setParameter(string memory param, uint256 value)'
        ]);
        return paramInterface.encodeFunctionData('setParameter', [
          parameters.parameter,
          parameters.value
        ]);
        
      case 'contract-upgrade':
        // Encode proxy upgrade function call
        const upgradeInterface = new ethers.Interface([
          'function upgradeTo(address newImplementation)'
        ]);
        return upgradeInterface.encodeFunctionData('upgradeTo', [
          parameters.implementation
        ]);
        
      case 'role-management':
        // Encode role management function call
        const roleInterface = new ethers.Interface([
          'function grantRole(bytes32 role, address account)',
          'function revokeRole(bytes32 role, address account)'
        ]);
        
        const roleHash = ethers.keccak256(ethers.toUtf8Bytes(parameters.role));
        const functionName = parameters.action === 'Grant Role' ? 'grantRole' : 'revokeRole';
        
        return roleInterface.encodeFunctionData(functionName, [
          roleHash,
          parameters.user
        ]);
        
      default:
        // Fallback: encode as generic function call
        return ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(parameters)));
    }
  } catch (error: any) {
    console.error('Error generating encoded action:', error);
    // Fallback to JSON encoding
    return ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(parameters)));
  }
}

/**
 * Format proposal status for display
 */
export function formatProposalStatus(status: ProposalStatus): string {
  switch (status) {
    case ProposalStatus.Created:
      return 'Created';
    case ProposalStatus.Executed:
      return 'Executed';
    default:
      return 'Unknown';
  }
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get block explorer URL for transaction
 */
export function getExplorerUrl(txHash: string): string {
  const baseUrl = import.meta.env.VITE_SOMNIA_BLOCK_EXPLORER || 'https://explorer.somnia.network';
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get block explorer URL for address
 */
export function getAddressExplorerUrl(address: string): string {
  const baseUrl = import.meta.env.VITE_SOMNIA_BLOCK_EXPLORER || 'https://explorer.somnia.network';
  return `${baseUrl}/address/${address}`;
}