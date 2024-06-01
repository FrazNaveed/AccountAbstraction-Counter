const { ethers } = require("hardhat");

async function deploy_wallet_factory() {
  console.log("Deploying the Smart Wallet Factory contract");

  const walletFactory = await ethers.getContractFactory("WalletFactory");
  const walletFactoryInstance = await walletFactory.deploy();
  await walletFactoryInstance.deployed();

  console.log(
    "Smart Wallet Factory Contract deployed to:",
    walletFactoryInstance.address
  );
  console.log("---------------------------------------------------------");
  return walletFactoryInstance;
}

module.exports = deploy_wallet_factory;
