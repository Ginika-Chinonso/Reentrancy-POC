// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Reentrancy {
    address public owner;
    mapping(address => uint256) public balances;

    constructor(){
        owner = msg.sender;
    }

    function onlyOwner() internal view {
        if (msg.sender != owner) revert ("Only owner can call this function");
    }

    function getBalance(address _addr) public view returns (uint256 _bal) {
        _bal = balances[_addr];
    }

    function deposit() public payable{
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public payable {
        require (balances[msg.sender] >= _amount, "You cant withdraw more than you deposited");
        payable(address(msg.sender)).call{value: _amount}("");
        // payable(address(msg.sender)).transfer(_amount);
        // require(success, "Failed to send funds");
        balances[msg.sender] -= _amount;
    }

    function withdrawAll() public payable {
        onlyOwner();
        uint balance = address(this).balance;
        (bool success,) = payable(owner).call{value: balance}("");
        require(success);
    }
}
