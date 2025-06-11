// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PetCoin.sol";
import "../src/PetNFT.sol";
import "../src/PetNFTMarket.sol";

contract PetNFTTest is Test {
    PetCoin       coin;
    PetNFT        nft;
    PetNFTMarket  market;

    address alice = vm.addr(1);
    address bob   = vm.addr(2);

    function setUp() public {
        coin   = new PetCoin(address(this));
        nft    = new PetNFT(address(coin));
        market = new PetNFTMarket(address(nft), address(coin));

        // 鑄些 PTC 給 Alice/Bob
        coin.mint(alice, 100 * 1e18);
        coin.mint(bob,   100 * 1e18);
    }

    function testMintAndTrade() public {
        string memory cid = "bafkreigh2akiscaildc";

        // Alice approve & mint
        vm.startPrank(alice);
        coin.approve(address(nft), type(uint256).max);
        nft.mint("Test Pet NFT", cid, "A cute pet NFT for testing");
        assertEq(nft.ownerOf(1), alice);

        // Alice list at 20 PTC
        nft.approve(address(market), 1);
        market.list(1, 20 * 1e18);
        vm.stopPrank();

        // Bob buy
        vm.startPrank(bob);
        coin.approve(address(market), 20 * 1e18);
        market.buy(1);
        assertEq(nft.ownerOf(1), bob);
        vm.stopPrank();
    }

    function testCIDUniqueness() public {
        string memory cid = "bafkreigh2akiscaildc";

        // Alice mint with CID
        vm.startPrank(alice);
        coin.approve(address(nft), type(uint256).max);
        nft.mint("Test Pet NFT", cid, "A cute pet NFT for testing");
        assertEq(nft.ownerOf(1), alice);
        
        // 檢查CID已被使用
        assertTrue(nft.isCIDUsed(cid));
        
        // 檢查CID對應的Token ID
        assertEq(nft.getTokenIdByCID(cid), 1);
        vm.stopPrank();

        // Bob 嘗試使用相同CID鑄造 - 應該失敗
        vm.startPrank(bob);
        coin.approve(address(nft), type(uint256).max);
        vm.expectRevert("imageCID already used");
        nft.mint("Another Pet NFT", cid, "Another pet description");
        vm.stopPrank();
    }

    function testEmptyCID() public {
        string memory emptyCid = "";

        // Alice 嘗試使用空CID鑄造 - 應該失敗
        vm.startPrank(alice);
        coin.approve(address(nft), type(uint256).max);
        vm.expectRevert("imageCID cannot be empty");
        nft.mint("Test Pet NFT", emptyCid, "A test description");
        vm.stopPrank();
    }

    function testUnusedCIDQuery() public {
        string memory unusedCid = "bafkreighunusedcid123";

        // 檢查未使用的CID
        assertFalse(nft.isCIDUsed(unusedCid));
        
        // 查詢未使用CID的Token ID應該失敗
        vm.expectRevert("imageCID not used");
        nft.getTokenIdByCID(unusedCid);
    }
}
