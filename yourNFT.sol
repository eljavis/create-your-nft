// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public baseMetadataURI;

    constructor(string memory name, string memory symbol, string memory _baseMetadataURI) ERC721(name, symbol) {
        baseMetadataURI = _baseMetadataURI;
    }

    function mintNFT(address to, string memory metadataURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, metadataURI);
        return newItemId;
    }

     function _baseURI() internal view override returns (string memory) {
        return baseMetadataURI;
    }
}
