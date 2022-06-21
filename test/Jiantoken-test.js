const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
  let JianToken;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const JianTokenFactory = await ethers.getContractFactory("JianToken");
    JianToken = await JianTokenFactory.deploy(1000);
  });

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await JianToken.balanceOf(owner.address);
      expect(await JianToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      //Transfer 50 tokens from owner to addr1
      await JianToken.transfer(addr1.address, 50);
      const addr1Balance = await JianToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      //Transfer 50 tokens from addr1 to addr2
      await JianToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await JianToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await JianToken.balanceOf(owner.address);
      //Try to send 1 token form addr1(0 token) to owner(1000 tokens).
      await expect(
        JianToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      //Owner's balance remain same.
      expect(await JianToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await JianToken.balanceOf(owner.address);

      //Transfer 100 tokens from owner to addr1
      await JianToken.transfer(addr1.address, 100);

      //Transfer another 50 tokens from owner to addr2
      await JianToken.transfer(addr2.address, 50);

      //Check balances
      const finalOwnerBalance = await JianToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await JianToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await JianToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
