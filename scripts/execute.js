const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  [deployer] = await ethers.getSigners();

  const EP_ADDRESS = "";
  const SWF_ADDRESS = "";
  const PM_ADDRESS = "";
  const COUNTER_ADDRESS = "";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
