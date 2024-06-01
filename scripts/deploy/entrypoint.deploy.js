const { ethers } = require("hardhat");

async function deploy_entry_point() {
  console.log("Deploying the entry point contract");

  const entryPoint = await ethers.getContractFactory("EntryPoint");
  const entryPointInstance = await entryPoint.deploy();
  await entryPointInstance.deployed();

  console.log("EntryPoint Contract deployed to:", entryPointInstance.address);
  console.log("---------------------------------------------------------");
  return entryPointInstance;
}
module.exports = deploy_entry_point;
