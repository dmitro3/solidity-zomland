// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../interfaces/interface.sol";

  error LandsLimitError(string message, uint limit);
  error LandsSmallLimitError(string message);

contract LandNFTContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable {
  address internal mainContract;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;

  enum LandType {
    Small,
    Medium,
    Large
  }

  struct Land {
    uint tokenId;
    LandType landType;
    uint lastZombieClaim;
    uint salePrice;
    string media;
    string nftType;
    uint discoverEvents;
    address ownerId;
  }

  struct LandTypeData {
    uint price;
    uint limitCount;
    uint8 zombiesPerDay;
    string media;
  }

  mapping(uint8 => LandType) public landTypeIndex;
  mapping(LandType => uint) public landTypeCount;
  mapping(LandType => LandTypeData) public landTypeData;
  mapping(address => bool) accountsWithSmallLand;
  mapping(uint => Land) lands;

  //    modifier onlyMainContract() {
  //        require(contractMain == _msgSender(), "Caller is not main contract");
  //        _;
  //    }

  constructor(address _mainContract) ERC721("ZomLand", "ZMLL") {
    mainContract = _mainContract;

    landTypeIndex[0] = LandType.Small;
    landTypeIndex[1] = LandType.Medium;
    landTypeIndex[2] = LandType.Large;

    landTypeData[LandType.Small] = LandTypeData({
    price : 0,
    limitCount : 59999,
    zombiesPerDay : 1,
    media : "bafkreihvcoraixdyx6jbrlmlfw45psrjlkwemp7ie3wckye7frnyhbdnoi"
    });

    landTypeData[LandType.Medium] = LandTypeData({
    price : 5 ether,
    limitCount : 5999,
    zombiesPerDay : 4,
    media : "bafkreiepzrmwcequ5u6b5dx2jdrr2vq5ujehibu4v32zdxrg4jdgts2ozq"
    });

    landTypeData[LandType.Large] = LandTypeData({
    price : 9 ether,
    limitCount : 1999,
    zombiesPerDay : 8,
    media : "bafkreigezufih7gmv6d6xfbm3ackbvsxxbw5mprlt3hx5kvte7kjkbaxju"
    });
  }

  function _baseURI() internal pure override returns (string memory) {
    return "https://ipfs.io/ipfs/";
  }

  function _beforeTokenTransfer(address _from, address _to, uint _tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(_from, _to, _tokenId);
  }

  function _burn(uint _tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(_tokenId);
  }

  // small=0, medium=5, large=9
  function landTypeByPrice() internal view returns (LandType) {
    if (msg.value == landTypeData[LandType.Small].price) {
      return LandType.Small;
    } else if (msg.value == landTypeData[LandType.Medium].price) {
      return LandType.Medium;
    } else if (msg.value == landTypeData[LandType.Large].price) {
      return LandType.Large;
    }
    revert("Wrong deposit amount");
  }

  function checkLimits(LandType _landType) internal view {
    uint _maxCount = landTypeData[_landType].limitCount;
    if (_landType == LandType.Small) {
      // limit one small lend per account
      if (accountsWithSmallLand[msg.sender] == true) {
        revert LandsSmallLimitError({message : "You can mint just one Small Land"});
      }
    }

    if (landTypeCount[_landType] >= _maxCount) {
      revert LandsLimitError({message : "You can't mint lands of this type, limit reached", limit : _maxCount});
    }
  }

  // ---------------- Public methods ---------------

  function getAllLands() public view returns (LandTypeData[] memory) {
    LandTypeData[] memory _lands = new LandTypeData[](3);
    for (uint8 i = 0; i < 3; ++i) {
      _lands[i] = landTypeData[landTypeIndex[i]];
    }
    return _lands;
  }

  function getLandMintZombiesCount(uint _landId) external view returns (uint8) {
    uint _oneDaySeconds = 60 * 60 * 24;
    if (block.timestamp - lands[_landId].lastZombieClaim >= _oneDaySeconds) {
      LandType _landType = lands[_landId].landType;
      return landTypeData[_landType].zombiesPerDay;
    }
    return 0;
  }

  function landSetMintTimestamp(uint _landId) external {
    // TODO: allow just for Zombies contract.
    lands[_landId].lastZombieClaim = block.timestamp;
  }

  function safeMint() public payable returns (uint) {
    LandType _landType = landTypeByPrice();

    checkLimits(_landType);
    string memory _uri = landTypeData[_landType].media;

    uint _tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);

    lands[_tokenId] = Land(_tokenId, _landType, 0, 0, landTypeData[_landType].media, "Land", 0, msg.sender);
    landTypeCount[_landType]++;
    if (_landType == LandType.Small) {
      accountsWithSmallLand[msg.sender] = true;
    }

    return _tokenId;
  }

  function userLands() public view returns (Land[] memory) {
    uint _userLandsCount = super.balanceOf(msg.sender);
    Land[] memory _userLands = new Land[](_userLandsCount);

    for (uint _i = 0; _i < _userLandsCount; ++_i) {
      uint _landId = super.tokenOfOwnerByIndex(msg.sender, _i);
      _userLands[_i] = lands[_landId];
    }
    return _userLands;
  }

  function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
    return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(_interfaceId);
  }
}