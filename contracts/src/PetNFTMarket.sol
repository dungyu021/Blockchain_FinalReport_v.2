// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./PetCoin.sol";

/// @title 固定價格 NFT 市集 (PTC 結算)
contract PetNFTMarket is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price; // 單位：PTC (18 decimals)
    }

    IERC721  public immutable nft;
    PetCoin  public immutable petCoin;
    mapping(uint256 => Listing) public listings;

    event Listed(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );
    event Canceled(address indexed seller, uint256 indexed tokenId);
    event Purchased(
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 price
    );

    constructor(address nftAddr, address petCoinAddr) {
        require(nftAddr != address(0) && petCoinAddr != address(0), "zero");
        nft     = IERC721(nftAddr);
        petCoin = PetCoin(petCoinAddr);
    }

    /// @notice 上架；先在前端將 tokenId Approve 給本合約
    function list(uint256 tokenId, uint256 price) external {
        require(nft.ownerOf(tokenId) == msg.sender, "not owner");
        require(price > 0, "price = 0");
        require(
            nft.getApproved(tokenId) == address(this),
            "approve NFT first"
        );
        listings[tokenId] = Listing(msg.sender, price);
        emit Listed(msg.sender, tokenId, price);
    }

    /// 取消上架
    function cancel(uint256 tokenId) external {
        Listing memory l = listings[tokenId];
        require(l.seller == msg.sender, "not seller");
        delete listings[tokenId];
        emit Canceled(msg.sender, tokenId);
    }

    /// 直接購買
    function buy(uint256 tokenId) external nonReentrant {
        Listing memory l = listings[tokenId];
        require(l.price > 0, "not listed");

        // 支付 PetCoin
        require(
            petCoin.allowance(msg.sender, address(this)) >= l.price,
            "approve PTC first"
        );
        petCoin.transferFrom(msg.sender, l.seller, l.price);

        // 轉移 NFT
        nft.safeTransferFrom(l.seller, msg.sender, tokenId);
        delete listings[tokenId];

        emit Purchased(msg.sender, tokenId, l.price);
    }
}
