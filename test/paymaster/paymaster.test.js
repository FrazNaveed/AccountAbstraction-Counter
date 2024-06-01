const { expect } = require("chai");
const paymasterFixture = require("./paymaster.fixture");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Paymaster", async () => {
  beforeEach(async () => {
    ({
      sender,
      epInstance,
      pmInstance,
      beneficiary,
      walletOwner,
      counterInstance,
      signUserOp,
    } = await loadFixture(paymasterFixture));
  });
  it("Should increment the counter by 1", async () => {
    const swInstance = await ethers.getContractAt("SmartWallet", sender);
    const nonce = await swInstance.nonce();
    const callData = swInstance.interface.encodeFunctionData(
      "executeFromEntryPoint",
      [
        counterInstance.address,
        0,
        counterInstance.interface.encodeFunctionData("increaseCounter"),
      ]
    );
    const UserOp = {
      sender: sender,
      nonce: nonce,
      initCode: "0x",
      callData: callData,
      callGasLimit: ethers.BigNumber.from("2000000"),
      verificationGasLimit: ethers.BigNumber.from("3000000"),
      preVerificationGas: ethers.BigNumber.from("1000000"),
      maxFeePerGas: ethers.BigNumber.from("1000105660"),
      maxPriorityFeePerGas: ethers.BigNumber.from("1000000000"),
      paymasterAndData: "0x",
      signature: "0x",
    };
    UserOp.paymasterAndData = ethers.utils.solidityPack(
      ["address"],
      [pmInstance.address]
    );
    const userOpHash = await epInstance.getUserOpHash(UserOp);
    const signature = signUserOp(userOpHash, walletOwner);
    // await walletOwner.signMessage(
    //   ethers.utils.arrayify(userOpHash)
    // );
    UserOp.signature = signature;
    const userOps = [UserOp];
    await epInstance.handleOps(userOps, beneficiary.address);
    const counter = await counterInstance.getCounter();
    console.log(counter, "counter");
  });
});
