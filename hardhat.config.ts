import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    somnia: {
      url: process.env.VITE_SOMNIA_RPC_URL || "https://rpc.somnia.network",
      chainId: parseInt(process.env.VITE_SOMNIA_CHAIN_ID || "2648"),
      accounts: process.env.SOMNIA_PRIVATE_KEY ? [process.env.SOMNIA_PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
    somniaTestnet: {
      url: process.env.VITE_SOMNIA_TESTNET_RPC_URL || "https://testnet-rpc.somnia.network",
      chainId: parseInt(process.env.VITE_SOMNIA_TESTNET_CHAIN_ID || "2649"),
      accounts: process.env.SOMNIA_PRIVATE_KEY ? [process.env.SOMNIA_PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: {
      somnia: process.env.SOMNIA_EXPLORER_API_KEY || "placeholder",
    },
    customChains: [
      {
        network: "somnia",
        chainId: parseInt(process.env.VITE_SOMNIA_CHAIN_ID || "2648"),
        urls: {
          apiURL: process.env.VITE_SOMNIA_BLOCK_EXPLORER + "/api" || "https://explorer.somnia.network/api",
          browserURL: process.env.VITE_SOMNIA_BLOCK_EXPLORER || "https://explorer.somnia.network",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;