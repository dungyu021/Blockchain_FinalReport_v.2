// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PetCoin.sol";

/**
 * @title DeployPetCoin
 * @dev Script to deploy PetCoin contract
 */
contract DeployPetCoin is Script {
    function run() external {
        // 從環境變數獲取私鑰
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // 開始廣播交易
        vm.startBroadcast(deployerPrivateKey);
        
        // 獲取部署者地址
        address deployer = vm.addr(deployerPrivateKey);
        
        // 部署 PetCoin 合約
        PetCoin petCoin = new PetCoin(deployer);
        
        console.log("PetCoin contract deployed to:", address(petCoin));
        console.log("Deployer address:", deployer);
        console.log("Initial supply:", petCoin.totalSupply());
        console.log("Deployer balance:", petCoin.balanceOf(deployer));
        
        vm.stopBroadcast();
    }
} 