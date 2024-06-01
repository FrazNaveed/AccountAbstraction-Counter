const { ethers } = require("hardhat");
const {
  ecsign,
  toRpcSig,
  keccak256: keccak256_buffer,
} = require("ethereumjs-util");

const deploy_entry_point = require("../../scripts/deploy/entrypoint.deploy");
const deploy_wallet_factory = require("../../scripts/deploy/walletFactory.deploy");
const deploy_paymaster = require("./paymaster.deploy");
const deploy_counter = require("../../scripts/deploy/counter.deploy");

function signUserOp(userOpHash, signer) {
  const msg1 = Buffer.concat([
    Buffer.from("\x19Ethereum Signed Message:\n32", "ascii"),
    Buffer.from(ethers.utils.arrayify(userOpHash)),
  ]);

  const sig = ecsign(
    keccak256_buffer(msg1),
    Buffer.from(ethers.utils.arrayify(signer.privateKey))
  );
  // that's equivalent of:  await signer.signMessage(message);
  // (but without "async"
  const signedMessage1 = toRpcSig(sig.v, sig.r, sig.s);
  return signedMessage1;
}

async function paymasterFixture() {
  const walletOwner = ethers.Wallet.createRandom();
  const beneficiary = ethers.Wallet.createRandom();

  const salt = ethers.BigNumber.from("0x101");
  const unstakeDelay = 10;
  const epInstance = await deploy_entry_point();
  const wfInstance = await deploy_wallet_factory();
  const pmInstance = await deploy_paymaster(epInstance);
  const counterInstance = await deploy_counter();

  const sender = await wfInstance.computeAddress(
    epInstance.address,
    walletOwner.address,
    salt
  );
  // await wfInstance.deployWallet(epInstance.address, walletOwner.address, salt);
  // const swInstance = await ethers.getContractAt("SmartWallet", sender);

  // // 1. Generate a userOperation

  const UserOp = {
    sender: sender,
    nonce: 0, // 0 nonce, wallet is not deployed and won't be called
    initCode: "0x",
    callData: "0x",
    callGasLimit: ethers.BigNumber.from("2000000"),
    verificationGasLimit: ethers.BigNumber.from("3000000"),
    preVerificationGas: ethers.BigNumber.from("1000000"),
    maxFeePerGas: ethers.BigNumber.from("1000105660"),
    maxPriorityFeePerGas: ethers.BigNumber.from("1000000000"),
    paymasterAndData: "0x",
    signature: "0x",
  };

  //2. creating init code
  const initCode = ethers.utils.solidityPack(
    ["address", "bytes"],
    [
      wfInstance.address,
      wfInstance.interface.encodeFunctionData("deployWallet", [
        epInstance.address,
        walletOwner.address,
        salt,
      ]),
    ]
  );

  UserOp.initCode = initCode;

  // 3. Set paymaster on userOperation
  UserOp.paymasterAndData = ethers.utils.solidityPack(
    ["address"],
    [pmInstance.address]
  );

  // 4. Sign userOperation and attach signature
  const userOpHash = await epInstance.getUserOpHash(UserOp);

  const signature = signUserOp(userOpHash, walletOwner);
  // await walletOwner.signMessage(
  //   ethers.utils.arrayify(userOpHash)
  // );

  UserOp.signature = signature;

  await ethers.provider.send("hardhat_setBalance", [
    pmInstance.address,
    "0x15af1d78b58c400000",
  ]); // 25 ether

  await pmInstance.addStake(unstakeDelay, {
    value: ethers.utils.parseEther("2"),
  });

  await pmInstance.deposit({
    value: ethers.utils.parseEther("2"),
  });
  const userOps = [UserOp];
  await epInstance.handleOps(userOps, beneficiary.address);

  return {
    sender,
    epInstance,
    pmInstance,
    beneficiary,
    walletOwner,
    counterInstance,
    signUserOp,
  };
}

module.exports = paymasterFixture;
