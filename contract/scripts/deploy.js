const hre = require("hardhat");

async function main() {
  const NexoraRewards = await hre.ethers.getContractFactory("NexoraRewards");
  const rewards = await NexoraRewards.deploy();
  await rewards.waitForDeployment();  // Updated from .deployed()

  console.log("✅ Contract deployed to:", await rewards.getAddress());  // Updated from .address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
