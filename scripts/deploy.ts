import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Starting ProposalFactory deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "STM");
  
  if (balance === 0n) {
    throw new Error("❌ Deployer account has no balance. Please fund the account with STM tokens.");
  }
  
  // Deploy ProposalFactory
  console.log("🏗️  Deploying ProposalFactory contract...");
  const ProposalFactory = await ethers.getContractFactory("ProposalFactory");
  const proposalFactory = await ProposalFactory.deploy();
  
  await proposalFactory.waitForDeployment();
  const contractAddress = await proposalFactory.getAddress();
  
  console.log("✅ ProposalFactory deployed to:", contractAddress);
  console.log("🔗 Transaction hash:", proposalFactory.deploymentTransaction()?.hash);
  
  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const proposalCount = await proposalFactory.getProposalCount();
  console.log("📊 Initial proposal count:", proposalCount.toString());
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployerAddress: deployer.address,
    network: await deployer.provider.getNetwork(),
    deploymentTime: new Date().toISOString(),
    transactionHash: proposalFactory.deploymentTransaction()?.hash,
  };
  
  // Create deployment directory if it doesn't exist
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  // Save deployment info to file
  const deploymentFile = path.join(deploymentDir, "ProposalFactory.json");
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);
  
  // Generate ABI file for frontend
  const artifactPath = path.join(__dirname, "../artifacts/contracts/ProposalFactory.sol/ProposalFactory.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const abiFile = path.join(__dirname, "../src/contracts/ProposalFactory.json");
  const abiDir = path.dirname(abiFile);
  
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }
  
  fs.writeFileSync(abiFile, JSON.stringify({
    address: contractAddress,
    abi: artifact.abi
  }, null, 2));
  
  console.log("📄 ABI file generated for frontend:", abiFile);
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Summary:");
  console.log("   Contract Address:", contractAddress);
  console.log("   Network:", (await deployer.provider.getNetwork()).name);
  console.log("   Chain ID:", (await deployer.provider.getNetwork()).chainId);
  console.log("   Deployer:", deployer.address);
  console.log("   Gas Used:", proposalFactory.deploymentTransaction()?.gasLimit?.toString());
  
  console.log("\n🔧 Next steps:");
  console.log("1. Update your .env file with the contract address");
  console.log("2. Fund your wallet with testnet tokens if needed");
  console.log("3. Test the contract integration in your frontend");
  console.log("4. Consider verifying the contract on the block explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });