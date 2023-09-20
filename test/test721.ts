import hre from 'hardhat' 
import assert from 'assert'
import { ethers } from "hardhat"
import { Signer } from "ethers"
import { expect } from "chai"

describe("Test of ERC721", function () {

  describe("Deployment", function () {

    beforeEach(async function () {
      this.ContractProxy = await hre.ethers.getContractFactory('TransparentUpgradeableProxy')
      this.ContractV1 = await hre.ethers.getContractFactory('EPASSVer1')
      this.ContractV2 = await hre.ethers.getContractFactory('EPASSVer2')
    })

    it("address check", async function () {

      const [owner, otherAccount1 , otherAccount2] = await ethers.getSigners()

      const NFTContract = await hre.upgrades.deployProxy(this.ContractV1, [] , {initializer: "initialize" })
      //const newNFTContract = await this.ContractV2.connect(owner).deploy()

      let ownerAddress = await NFTContract.owner()
      let balance
      
      await NFTContract.connect(owner).setMintLimit(20000);
      await NFTContract.connect(owner).adminMint(10);

      balance = await NFTContract.balanceOf(owner.address)

      console.log(NFTContract.address)
      console.log(balance)

      const newNFTContract = await hre.upgrades.upgradeProxy(NFTContract, this.ContractV2)

      expect( await newNFTContract.getContractAllowListOfSetapprovalforall(owner.address) ).to.equals(false);
      await expect( newNFTContract.connect(owner).setContractAllowListOfSetapprovalforall(owner.address , true) ).not.reverted;
      expect( await newNFTContract.getContractAllowListOfSetapprovalforall(owner.address) ).to.equals(true);

      balance = await newNFTContract.balanceOf(owner.address)
      console.log(newNFTContract.address)
      console.log(balance)

    })

/*
    it("address check", async function () {

      const [owner, otherAccount1 , otherAccount2] = await ethers.getSigners()

      const NFTContract = await this.ContractV1.connect(owner).deploy()
      const newNFTContract = await this.ContractV2.connect(owner).deploy()

      const proxyContract = await this.ContractProxy.connect(owner).deploy(NFTContract.address , owner.address , [])


      //（´・ω・｀）これどうするんだろう？
      await proxyContract.connect(owner).initialize();


      let balance      
      let ownerAddress = await proxyContract.owner()
      await proxyContract.connect(owner).setMintLimit(20000);
      await proxyContract.connect(owner).adminMint(10);

      balance = await proxyContract.balanceOf(owner.address)

      console.log(proxyContract.address)
      console.log(balance)

      await proxyContract.connect(owner).upgradeTo(newNFTContract.address)


    })

*/


  })

  




})
