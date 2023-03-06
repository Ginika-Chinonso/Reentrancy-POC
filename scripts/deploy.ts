import { ethers } from "hardhat";

async function main() {

  const [owner] = await ethers.getSigners()

  const REENTRANCY = await ethers.getContractFactory("Reentrancy")
  const ReentrancyContract = await REENTRANCY.deploy()
  await ReentrancyContract.deployed()


  const ATTACK = await ethers.getContractFactory("Attack");
  const AttackContract = await ATTACK.deploy(ReentrancyContract.address, {value: `${await ethers.utils.parseEther("1")}`});
  await AttackContract.deployed();

  // console.log(`Balance of owner before deposit: ${await ReentrancyContract.getBalance(owner.address)}`)
  console.log(`Balance of Reentrancy contract before deposit: ${await ethers.provider.getBalance(`${await ReentrancyContract.address}`)}`)

  await ReentrancyContract.deposit({value: ethers.utils.parseEther("5")})

  console.log(`Balance of Reentrancy contract after deposit: ${await ethers.provider.getBalance(`${await ReentrancyContract.address}`)}`)


  console.log(`Balance of Attack contract before deposit: ${await ethers.provider.getBalance(`${await AttackContract.address}`)}`)
  
  await AttackContract.deposit();
  
  console.log(`Balance of Attack contract after deposit: ${await ethers.provider.getBalance(`${await AttackContract.address}`)}`)
  

  // const withdrawAmount = ethers.utils.parseEther("1");
  // console.log(`Balance of owner before withdrawal: ${await ReentrancyContract.getBalance(owner.address)}`)
  // console.log(`Balance of Reentrancy contract before withdrawal: ${await ethers.provider.getBalance(`${await ReentrancyContract.address}`)}`)
  console.log(`Balance of Reentrancy contract before attack: ${await ethers.provider.getBalance(`${await ReentrancyContract.address}`)}`)
  // await ReentrancyContract.withdraw(withdrawAmount);
  
  
  console.log(`Start attack`)
  // console.log(`Balance of attack contract before attack: ${await ReentrancyContract.getBalance(AttackContract.address)}`)
  
  await AttackContract.attack();
  console.log(`Balance of Attack contract after attack: ${await ethers.provider.getBalance(`${await AttackContract.address}`)}`)
  
  
  // console.log(`Balance of owner before rug: ${await ReentrancyContract.getBalance(owner.address)}`)
  // console.log(`Balance of Reentrancy contract before rug: ${await ethers.provider.getBalance(`${await ReentrancyContract.address}`)}`)
  console.log(`Balance of Reentrancy contract after attack: ${await ethers.provider.getBalance(`${await ReentrancyContract.address}`)}`)
  // await ReentrancyContract.withdrawAll()


  // console.log(`Balance of Reentrancy contract after rug: ${await ethers.provider.getBalance(`${await ReentrancyContract.address}`)}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
