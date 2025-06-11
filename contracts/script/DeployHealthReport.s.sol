// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/HealthReport.sol";

/**
 * @title DeployHealthReport
 * @dev Script to deploy HealthReport contract
 */
contract DeployHealthReport is Script {
    function run() external {
        // 從環境變數獲取私鑰
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // 開始廣播交易
        vm.startBroadcast(deployerPrivateKey);
        
        // 獲取部署者地址
        address deployer = vm.addr(deployerPrivateKey);
        
        // 部署 HealthReport 合約
        HealthReport healthReport = new HealthReport(deployer);
        
        console.log("HealthReport contract deployed to:", address(healthReport));
        console.log("Deployer address:", deployer);
        console.log("Contract owner:", healthReport.owner());
        console.log("Initial report counter:", healthReport.reportCounter());
        
        vm.stopBroadcast();
    }
} 