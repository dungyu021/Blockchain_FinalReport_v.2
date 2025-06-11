// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PetCoin.sol";

contract PetCoinTest is Test {
    PetCoin public petCoin;
    address public owner;
    address public user1;
    address public user2;
    address public healthContract;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        healthContract = address(0x3);
        
        petCoin = new PetCoin(owner);
    }

    function testInitialState() public {
        assertEq(petCoin.name(), "PetCoin");
        assertEq(petCoin.symbol(), "PTC");
        assertEq(petCoin.decimals(), 18);
        assertEq(petCoin.totalSupply(), 1000000 * 10**18);
        assertEq(petCoin.balanceOf(owner), 1000000 * 10**18);
        assertEq(petCoin.owner(), owner);
    }

    function testSetHealthRecordContract() public {
        petCoin.setHealthRecordContract(healthContract);
        assertEq(petCoin.healthRecordContract(), healthContract);
    }

    function testSetHealthRecordContractOnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        petCoin.setHealthRecordContract(healthContract);
    }

    function testRewardUser() public {
        // 設定健康報告合約
        petCoin.setHealthRecordContract(healthContract);
        
        // 模擬健康報告合約調用
        vm.prank(healthContract);
        petCoin.rewardUser(user1);
        
        assertEq(petCoin.balanceOf(user1), petCoin.HEALTH_REPORT_REWARD());
    }

    function testRewardUserOnlyHealthContract() public {
        petCoin.setHealthRecordContract(healthContract);
        
        // 非健康報告合約調用應該失敗
        vm.prank(user1);
        vm.expectRevert("PetCoin: Only health record contract can call");
        petCoin.rewardUser(user2);
    }

    function testMint() public {
        uint256 mintAmount = 1000 * 10**18;
        petCoin.mint(user1, mintAmount);
        
        assertEq(petCoin.balanceOf(user1), mintAmount);
        assertEq(petCoin.totalSupply(), 1000000 * 10**18 + mintAmount);
    }

    function testMintOnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        petCoin.mint(user2, 1000 * 10**18);
    }

    function testBurn() public {
        uint256 burnAmount = 1000 * 10**18;
        petCoin.burn(burnAmount);
        
        assertEq(petCoin.balanceOf(owner), 1000000 * 10**18 - burnAmount);
        assertEq(petCoin.totalSupply(), 1000000 * 10**18 - burnAmount);
    }

    function testTransfer() public {
        uint256 transferAmount = 1000 * 10**18;
        petCoin.transfer(user1, transferAmount);
        
        assertEq(petCoin.balanceOf(user1), transferAmount);
        assertEq(petCoin.balanceOf(owner), 1000000 * 10**18 - transferAmount);
    }
} 