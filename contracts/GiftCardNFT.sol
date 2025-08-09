// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC6551Registry.sol";
import "./ERC6551Account.sol";

/**
 * @title GiftCardNFT
 * @dev Main contract for GIFTY Card NFT with Token Bound Accounts (ERC-6551)
 * @custom:security-contact ferreiracavazin@gmail.com
 */
contract GiftCardNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    struct GiftCard {
        uint256 originalBalance;
        uint256 currentBalance;
        uint256 createdAt;
        uint256 expiresAt;
        address merchant;
        address tbaAccount;
        bool isActive;
        string category;
    }
    
    mapping(uint256 => GiftCard) public giftCards;
    mapping(address => uint256[]) public userGiftCards;
    
    address public immutable registry;
    address public immutable accountImplementation;
    address public immutable stablecoin; // USDC or similar
    
    Counters.Counter private _tokenIds;
    
    // Events
    event GiftCardCreated(
        uint256 indexed tokenId,
        address indexed owner,
        address indexed tbaAccount,
        uint256 balance,
        uint256 expiresAt
    );
    
    event GiftCardRedeemed(
        uint256 indexed tokenId,
        address indexed merchant,
        uint256 amount,
        uint256 remainingBalance
    );
    
    event GiftCardReloaded(
        uint256 indexed tokenId,
        uint256 amount,
        uint256 newBalance
    );
    
    event GiftCardTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    modifier onlyTokenOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _;
    }

    modifier validGiftCard(uint256 tokenId) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(giftCards[tokenId].isActive, "Gift card is not active");
        require(block.timestamp <= giftCards[tokenId].expiresAt, "Gift card expired");
        _;
    }

    constructor(
        address _registry,
        address _accountImplementation,
        address _stablecoin
    ) ERC721("GIFTY Card", "GIFTY") Ownable(msg.sender) {
        require(_registry != address(0), "Invalid registry address");
        require(_accountImplementation != address(0), "Invalid account implementation");
        require(_stablecoin != address(0), "Invalid stablecoin address");
        
        registry = _registry;
        accountImplementation = _accountImplementation;
        stablecoin = _stablecoin;
    }

    /**
     * @dev Creates a new gift card NFT with Token Bound Account
     * @param to Recipient address
     * @param balance Initial balance in stablecoin
     * @param expirationMonths Months until expiration
     * @param category Gift card category
     * @param uri Token URI for metadata
     */
    function createGiftCard(
        address to,
        uint256 balance,
        uint256 expirationMonths,
        string memory category,
        string memory uri
    ) external returns (uint256 tokenId, address tbaAccount) {
        require(to != address(0), "Invalid recipient");
        require(balance > 0, "Balance must be positive");
        require(expirationMonths > 0 && expirationMonths <= 60, "Invalid expiration period");
        
        // Transfer stablecoin from sender
        IERC20(stablecoin).transferFrom(msg.sender, address(this), balance);
        
        _tokenIds.increment();
        tokenId = _tokenIds.current();
        
        // Mint NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Create Token Bound Account
        bytes32 salt = keccak256(abi.encodePacked(tokenId, block.timestamp));
        tbaAccount = ERC6551Registry(registry).createAccount(
            accountImplementation,
            block.chainid,
            address(this),
            tokenId,
            salt
        );
        
        // Transfer balance to TBA
        IERC20(stablecoin).transfer(tbaAccount, balance);
        
        // Store gift card data
        uint256 expiresAt = block.timestamp + (expirationMonths * 30 days);
        giftCards[tokenId] = GiftCard({
            originalBalance: balance,
            currentBalance: balance,
            createdAt: block.timestamp,
            expiresAt: expiresAt,
            merchant: address(0),
            tbaAccount: tbaAccount,
            isActive: true,
            category: category
        });
        
        userGiftCards[to].push(tokenId);
        
        emit GiftCardCreated(tokenId, to, tbaAccount, balance, expiresAt);
        
        return (tokenId, tbaAccount);
    }

    /**
     * @dev Redeems gift card at merchant
     * @param tokenId Gift card token ID
     * @param amount Amount to redeem
     * @param merchant Merchant address
     */
    function redeemGiftCard(
        uint256 tokenId,
        uint256 amount,
        address merchant
    ) external onlyTokenOwner(tokenId) validGiftCard(tokenId) {
        require(merchant != address(0), "Invalid merchant");
        require(amount > 0, "Amount must be positive");
        
        GiftCard storage card = giftCards[tokenId];
        require(card.currentBalance >= amount, "Insufficient balance");
        
        // Execute transfer from TBA to merchant
        bytes memory transferData = abi.encodeWithSignature(
            "transfer(address,uint256)",
            merchant,
            amount
        );
        
        ERC6551Account(payable(card.tbaAccount)).executeCall(
            stablecoin,
            0,
            transferData
        );
        
        // Update balances
        card.currentBalance -= amount;
        card.merchant = merchant;
        
        // Deactivate if fully redeemed
        if (card.currentBalance == 0) {
            card.isActive = false;
        }
        
        emit GiftCardRedeemed(tokenId, merchant, amount, card.currentBalance);
    }

    /**
     * @dev Reloads gift card with additional funds
     * @param tokenId Gift card token ID
     * @param amount Amount to add
     */
    function reloadGiftCard(
        uint256 tokenId,
        uint256 amount
    ) external validGiftCard(tokenId) {
        require(amount > 0, "Amount must be positive");
        
        GiftCard storage card = giftCards[tokenId];
        
        // Transfer additional funds from sender to TBA
        IERC20(stablecoin).transferFrom(msg.sender, card.tbaAccount, amount);
        
        // Update balance
        card.currentBalance += amount;
        
        emit GiftCardReloaded(tokenId, amount, card.currentBalance);
    }

    /**
     * @dev Gets gift card details
     * @param tokenId Gift card token ID
     */
    function getGiftCard(uint256 tokenId) 
        external 
        view 
        returns (GiftCard memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return giftCards[tokenId];
    }

    /**
     * @dev Gets user's gift cards
     * @param user User address
     */
    function getUserGiftCards(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userGiftCards[user];
    }

    /**
     * @dev Gets TBA address for token
     * @param tokenId Gift card token ID
     */
    function getTBAAddress(uint256 tokenId) 
        external 
        view 
        returns (address) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return giftCards[tokenId].tbaAccount;
    }

    /**
     * @dev Emergency function to pause a gift card
     * @param tokenId Gift card token ID
     */
    function pauseGiftCard(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        giftCards[tokenId].isActive = false;
    }

    /**
     * @dev Override transfer to update user mapping
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        if (from != address(0) && to != address(0)) {
            // Remove from old owner's list
            uint256[] storage fromCards = userGiftCards[from];
            for (uint256 i = 0; i < fromCards.length; i++) {
                if (fromCards[i] == tokenId) {
                    fromCards[i] = fromCards[fromCards.length - 1];
                    fromCards.pop();
                    break;
                }
            }
            
            // Add to new owner's list
            userGiftCards[to].push(tokenId);
            
            emit GiftCardTransferred(tokenId, from, to);
        }
        
        return super._update(to, tokenId, auth);
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}