//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JianToken is ERC20, Ownable{

    constructor() ERC20("Jian Token","JT"){}

    function mint(address account_, uint256 amount_) public onlyOwner{
        _mint(account_, amount_);
    }
}
