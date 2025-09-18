# 🚀 Smart Contract Deployment Guide

This guide will walk you through deploying the ProposalFactory contract to Somnia Testnet.

## 📋 Prerequisites

1. **Node.js & npm**: Ensure you have Node.js 18+ installed
2. **Wallet with STM tokens**: You'll need testnet STM tokens for gas fees
3. **Private key**: Your wallet's private key for deployment

## 🔧 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your details:

```env
# Somnia Network Configuration
VITE_SOMNIA_RPC_URL=https://rpc.somnia.network
VITE_SOMNIA_CHAIN_ID=2648
VITE_SOMNIA_CHAIN_NAME=Somnia
VITE_SOMNIA_CURRENCY_NAME=STM
VITE_SOMNIA_CURRENCY_SYMBOL=STM
VITE_SOMNIA_CURRENCY_DECIMALS=18
VITE_SOMNIA_BLOCK_EXPLORER=https://explorer.somnia.network

# Deployment Configuration (KEEP PRIVATE!)
SOMNIA_PRIVATE_KEY=your_private_key_here
SOMNIA_WALLET_ADDRESS=your_wallet_address_here

# Testnet Configuration (if using testnet)
VITE_SOMNIA_TESTNET_RPC_URL=https://testnet-rpc.somnia.network
VITE_SOMNIA_TESTNET_CHAIN_ID=2649
```

### 3. Get Testnet Tokens
- Visit the Somnia testnet faucet
- Request STM tokens for your wallet address
- Ensure you have enough for gas fees (~0.01 STM should be sufficient)

## 🏗️ Deployment

### Compile Contracts
```bash
npm run compile
```

### Deploy to Testnet
```bash
npm run deploy:testnet
```

### Deploy to Mainnet
```bash
npm run deploy
```

### Deploy Locally (for testing)
```bash
npm run deploy:local
```

## 📊 Post-Deployment

After successful deployment, you'll see output like:

```
🚀 Starting ProposalFactory deployment...
📝 Deploying contracts with account: 0x1234...
💰 Account balance: 1.0 STM
🏗️  Deploying ProposalFactory contract...
✅ ProposalFactory deployed to: 0xABCD1234...
🔗 Transaction hash: 0x5678...
💾 Deployment info saved to: deployments/ProposalFactory.json
📄 ABI file generated for frontend: src/contracts/ProposalFactory.json
```

### Update Frontend Configuration

1. **Update Contract Address**: The deployment script automatically updates `src/contracts/ProposalFactory.json` with the deployed address.

2. **Verify in Browser**: Open your application and test the contract integration.

## 🧪 Testing

### Run Contract Tests
```bash
npx hardhat test
```

### Test Coverage
```bash
npx hardhat coverage
```

## 🔍 Verification

### Verify on Block Explorer
```bash
npx hardhat verify --network somnia <CONTRACT_ADDRESS>
```

## 📁 Generated Files

After deployment, you'll find:

- `deployments/ProposalFactory.json` - Deployment information
- `src/contracts/ProposalFactory.json` - ABI and address for frontend
- `artifacts/` - Compiled contract artifacts
- `cache/` - Hardhat cache files

## 🚨 Security Notes

1. **Never commit private keys** to version control
2. **Use environment variables** for sensitive data
3. **Test thoroughly** on testnet before mainnet deployment
4. **Verify contract source code** on block explorer
5. **Consider using a hardware wallet** for mainnet deployments

## 🛠️ Troubleshooting

### Common Issues

**"Insufficient funds for gas"**
- Ensure your wallet has enough STM tokens
- Check the current gas price on the network

**"Nonce too high"**
- Reset your wallet's transaction history
- Or wait for pending transactions to complete

**"Network connection failed"**
- Verify RPC URL in `.env` file
- Check if the network is operational

**"Contract verification failed"**
- Ensure you're using the correct compiler version
- Check that all dependencies are properly installed

### Getting Help

- Check the [Hardhat documentation](https://hardhat.org/docs)
- Visit the [Somnia documentation](https://docs.somnia.network)
- Join the community Discord for support

## 🎉 Success!

Once deployed successfully, your Governance Proposal Generator is ready to create real on-chain proposals on Somnia Network!

The contract provides:
- ✅ Proposal creation with title, description, and encoded actions
- ✅ Proposal status tracking (Created/Executed)
- ✅ Proposer-only execution marking
- ✅ Query functions for proposals and statistics
- ✅ Event emission for frontend integration

Your users can now create governance proposals that are permanently stored on the Somnia blockchain!