# 🚀 Ultimate Flash USDT v2.1

A sophisticated Flash USDT implementation with advanced Trust Wallet integration and comprehensive features for educational and testing purposes.

## ✨ Key Features

- **🔥 Flash Minting** - Time-based token expiration (30 days default)
- **👑 VIP System** - Exempt addresses from expiration
- **📱 Trust Wallet Integration** - Enhanced metadata and logo support
- **🎨 Multi-Logo System** - 4 different logos for maximum compatibility
- **💰 Price Oracle** - Built-in $1.00 USD pricing
- **⚡ Batch Operations** - Mint to multiple addresses efficiently
- **🛡️ Advanced Security** - ReentrancyGuard and input validation
- **🔧 Emergency Controls** - Owner-only safety features

## 🔗 Contract Information

**Network:** BSC Mainnet (Chain ID: 56)
**Contract Address:** `0x99f97c023D64435c61c92Ad129C73549D0446f3E`
**Explorer:** https://bscscan.com/address/0x99f97c023D64435c61c92Ad129C73549D0446f3E

**Token Details:**
- **Name:** Tether USD
- **Symbol:** USDT
- **Decimals:** 6
- **Total Supply:** 900,000,000 USDT

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Deploy Contract
```bash
npx hardhat run scripts/deploy-fixed.js --network bscMainnet
```

### Add to Trust Wallet
**Mobile Page:** https://benevolent-longma-082868.netlify.app/mobile-add-token.html

**Manual Addition:**
```
Contract: 0x99f97c023D64435c61c92Ad129C73549D0446f3E
Symbol: USDT
Decimals: 6
Logo: https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png
```

## 📚 Documentation

- **[📖 Owner Manual](OWNER_MANUAL.md)** - Complete guide for contract owner
- **[🎯 Final Solution Report](FINAL_SOLUTION_REPORT.md)** - Technical implementation details
- **[🔧 Trust Wallet Submission](trust-wallet-submission/)** - Assets repository files

## 🏗️ Project Structure

```
Flash/
├── contracts/
│   └── UltimateFlashUSDTFixed.sol    # Main contract
├── scripts/
│   ├── deploy-fixed.js               # Deployment script
│   ├── check-mainnet-balance.js      # Balance checker
│   ├── download-tether-logo.js       # Logo downloader
│   └── submit-trust-wallet-assets.js # Trust Wallet submission
├── public/
│   ├── mobile-add-token.html         # Mobile wallet integration
│   ├── ultimate-flash-usdt-tokenlist.json # Token list
│   └── price-api.json                # Price API
├── trust-wallet-submission/          # Trust Wallet Assets files
├── OWNER_MANUAL.md                   # Owner documentation
├── FINAL_SOLUTION_REPORT.md          # Technical report
└── README.md                         # This file
```

## ⚠️ Important Notes

- **Educational Purpose Only** - This contract is for testing and educational purposes
- **Not Official Tether** - Not affiliated with official Tether USDT
- **Use Responsibly** - Comply with local laws and regulations
- **Security First** - Keep private keys secure and verify all transactions

## 🔧 Advanced Usage

### Flash Minting
```javascript
// Single mint
await contract.flashMint(recipientAddress, amount);

// Batch mint
await contract.batchFlashMint([address1, address2], [amount1, amount2]);
```

### VIP Management
```javascript
// Add VIP (tokens never expire)
await contract.setVIPStatus(address, true);

// Check VIP status
const isVIP = await contract.isVIP(address);
```

### System Controls
```javascript
// Toggle flash minting
await contract.toggleFlashMode();

// Set expiration period
await contract.setFlashPeriod(2592000); // 30 days
```

## 🌐 Integration Links

- **Token List:** https://benevolent-longma-082868.netlify.app/ultimate-flash-usdt-tokenlist.json
- **Price API:** https://benevolent-longma-082868.netlify.app/price-api.json
- **Mobile Add:** https://benevolent-longma-082868.netlify.app/mobile-add-token.html

## 📄 License

MIT License - See LICENSE file for details

---

**🎊 Ultimate Flash USDT v2.1 - The most advanced Flash USDT implementation with Trust Wallet integration!**
