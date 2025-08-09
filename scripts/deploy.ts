import { ethers } from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  console.log("Deploying GIFTY contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy ERC6551Registry
  console.log("\nDeploying ERC6551Registry...");
  const Registry = await ethers.getContractFactory("ERC6551Registry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("ERC6551Registry deployed to:", registryAddress);

  // Deploy ERC6551Account implementation
  console.log("\nDeploying ERC6551Account...");
  const Account = await ethers.getContractFactory("ERC6551Account");
  const accountImpl = await Account.deploy();
  await accountImpl.waitForDeployment();
  const accountImplAddress = await accountImpl.getAddress();
  console.log("ERC6551Account deployed to:", accountImplAddress);

  // Mock USDC address (use real address for production)
  const mockUSDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Sepolia USDC

  // Deploy GiftCardNFT
  console.log("\nDeploying GiftCardNFT...");
  const GiftCardNFT = await ethers.getContractFactory("GiftCardNFT");
  const giftCardNFT = await GiftCardNFT.deploy(
    registryAddress,
    accountImplAddress,
    mockUSDC
  );
  await giftCardNFT.waitForDeployment();
  const giftCardNFTAddress = await giftCardNFT.getAddress();
  console.log("GiftCardNFT deployed to:", giftCardNFTAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    contracts: {
      registry: registryAddress,
      accountImplementation: accountImplAddress,
      giftCardNFT: giftCardNFTAddress,
      usdc: mockUSDC,
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const deploymentFile = `deployments/${deploymentInfo.network.name || 'localhost'}.json`;
  writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", deploymentInfo.network.name || 'localhost');
  console.log("Registry:", registryAddress);
  console.log("Account Implementation:", accountImplAddress);
  console.log("GiftCardNFT:", giftCardNFTAddress);
  console.log("USDC:", mockUSDC);
  console.log("Deployment info saved to:", deploymentFile);

  // Verification instructions
  if (deploymentInfo.network.name !== 'localhost' && deploymentInfo.network.name !== 'hardhat') {
    console.log("\n=== Verification Commands ===");
    console.log(`npx hardhat verify --network ${deploymentInfo.network.name} ${registryAddress}`);
    console.log(`npx hardhat verify --network ${deploymentInfo.network.name} ${accountImplAddress}`);
    console.log(`npx hardhat verify --network ${deploymentInfo.network.name} ${giftCardNFTAddress} "${registryAddress}" "${accountImplAddress}" "${mockUSDC}"`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });