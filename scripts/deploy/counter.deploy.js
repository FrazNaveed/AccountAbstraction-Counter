const { ethers } = require("hardhat");

async function deploy_counter() {
  console.log("Deploying the Counter contract");

  const counter = await ethers.getContractFactory("Counter");
  const counterInstance = await counter.deploy();
  await counterInstance.deployed();

  console.log("Counter Contract deployed to:", counterInstance.address);
  console.log("---------------------------------------------------------");
  return counterInstance;
}

module.exports = deploy_counter;
