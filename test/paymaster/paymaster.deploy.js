const { ethers } = require("hardhat");

async function deploy_paymaster(entryPointInstance) {
  console.log("Deploying the Paymaster contract");

  const paymaster = await ethers.getContractFactory("PayMaster");
  const paymasterInstance = await paymaster.deploy(entryPointInstance.address);
  await paymasterInstance.deployed();

  console.log("Paymaster Contract deployed to:", paymasterInstance.address);
  console.log("---------------------------------------------------------");
  return paymasterInstance;
}

module.exports = deploy_paymaster;
