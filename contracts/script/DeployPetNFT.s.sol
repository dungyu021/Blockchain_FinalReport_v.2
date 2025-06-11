// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PetCoin.sol";
import "../src/PetNFT.sol";
import "../src/PetNFTMarket.sol";

/// @dev 以 Foundry Script 部署 NFT 與 Market，並印出地址
contract DeployPetNFT is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        // 若 PetCoin 已部署，可直接填地址；示範從 ENV 讀
        address petCoinAddr = vm.envAddress("PETCOIN_ADDR");
        PetCoin petCoin = PetCoin(petCoinAddr);

        // 部署 NFT
        PetNFT nft = new PetNFT(address(petCoin));

        // 部署 Market
        PetNFTMarket market = new PetNFTMarket(
            address(nft),
            address(petCoin)
        );

        console2.log("PetNFT =>", address(nft));
        console2.log("Market =>", address(market));

        vm.stopBroadcast();
    }
}
