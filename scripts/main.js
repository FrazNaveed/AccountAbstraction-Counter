const hre = require("hardhat");
const { ethers } = require("hardhat");

const deploy_entry_point = require("./deploy/entrypoint.deploy");
const deploy_wallet_factory = require("./deploy/walletFactory.deploy");
const deploy_paymaster = require("./deploy/paymaster.deploy");
const deploy_counter = require("./deploy/counter.deploy");

async function main() {
  [deployer] = await ethers.getSigners();

  const entryPointInstance = await deploy_entry_point();
  await deploy_wallet_factory();
  await deploy_paymaster(entryPointInstance);
  await deploy_counter();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
