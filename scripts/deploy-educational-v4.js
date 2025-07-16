const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
    console.log("🎓 نشر Ultimate Flash USDT v4.0 - Educational Enhanced");
    console.log("=" .repeat(70));
    
    // الحصول على deployer
    const [deployer] = await ethers.getSigners();
    console.log("📋 عنوان المنشر:", deployer.address);
    
    // فحص الرصيد
    const balance = await deployer.getBalance();
    console.log("💰 رصيد المنشر:", ethers.utils.formatEther(balance), "BNB");
    
    if (balance.lt(ethers.utils.parseEther("0.005"))) {
        throw new Error("❌ رصيد غير كافي للنشر (مطلوب 0.005 BNB على الأقل)");
    }
    
    console.log("\n🔧 نشر العقد التعليمي...");
    
    // نشر العقد
    const UltimateFlashUSDT = await ethers.getContractFactory("UltimateFlashUSDTEducational");
    const contract = await UltimateFlashUSDT.deploy();
    
    console.log("⏳ انتظار تأكيد النشر...");
    await contract.deployed();
    
    console.log("✅ تم نشر العقد التعليمي بنجاح!");
    console.log("📍 عنوان العقد:", contract.address);
    console.log("🔗 BSCScan:", `https://bscscan.com/address/${contract.address}`);
    
    // انتظار عدة تأكيدات قبل التحقق
    console.log("\n⏳ انتظار 3 تأكيدات للتحقق...");
    await contract.deployTransaction.wait(3);
    
    // فحص معلومات العقد التعليمي
    console.log("\n📊 فحص معلومات العقد التعليمي:");
    try {
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();
        const owner = await contract.owner();
        const systemInfo = await contract.getSystemInfo();
        
        console.log("📋 الاسم:", name);
        console.log("🔤 الرمز:", symbol);
        console.log("🔢 المنازل العشرية:", decimals);
        console.log("💰 الكمية الإجمالية:", ethers.utils.formatUnits(totalSupply, decimals));
        console.log("👑 المالك:", owner);
        console.log("📦 الإصدار:", systemInfo[0]);
        console.log("⚡ Flash مفعل:", systemInfo[1]);
        console.log("🚫 التداول مفعل:", systemInfo[4]);
        
        // فحص الإعدادات التعليمية
        const internalPrice = await contract.getInternalPrice();
        const burnSettings = await contract.getBurnSettings();
        const flashPeriodMinutes = await contract.getFlashPeriodInMinutes();
        const maxTransfer = await contract.getMaxTransferAmount();
        
        console.log("\n🎓 الإعدادات التعليمية:");
        console.log("💲 السعر الداخلي:", ethers.utils.formatUnits(internalPrice, 6), "USD");
        console.log("🔥 الحرق التلقائي:", burnSettings[0]);
        console.log("⏰ فترة السماح للحرق:", burnSettings[1], "ساعة");
        console.log("📅 فترة Flash:", flashPeriodMinutes, "دقيقة");
        console.log("📊 الحد الأقصى للتحويل:", ethers.utils.formatUnits(maxTransfer, 6), "USDT");
        
        // فحص DEX Blacklist
        const isPancakeRouterBlocked = await contract.isDEXBlacklisted("0x10ED43C718714eb63d5aA57B78B54704E256024E");
        const isPancakeFactoryBlocked = await contract.isDEXBlacklisted("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73");
        
        console.log("\n🥞 حالة PancakeSwap:");
        console.log("🚫 Router محظور:", isPancakeRouterBlocked);
        console.log("🚫 Factory محظور:", isPancakeFactoryBlocked);
        
    } catch (error) {
        console.log("⚠️ خطأ في فحص معلومات العقد:", error.message);
    }
    
    // حفظ معلومات النشر التعليمي
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
        version: "Ultimate Flash USDT v4.0 - Educational Enhanced",
        educational_features: {
            flashEnabled: true,
            flashPeriodMinutes: 43200, // 30 days default
            stealthMode: false,
            tradingEnabled: false,
            dexBlocking: true,
            internalPriceOracle: true,
            customBurnTiming: true,
            ownerControls: true,
            vipSystem: true,
            antiWhale: true,
            pausable: true,
            logoCount: 5,
            enhancedMetadata: true,
            githubPagesIntegration: true
        },
        urls: {
            githubPages: `https://flash-usdt.github.io/ultimate-flash-usdt/?contract=${contract.address}`,
            priceAPI: "https://flash-usdt.github.io/ultimate-flash-usdt/price-api.json",
            tokenListURL: "https://flash-usdt.github.io/ultimate-flash-usdt/ultimate-flash-usdt-tokenlist.json",
            mobileAddURL: "https://flash-usdt.github.io/ultimate-flash-usdt/mobile-add-token.html",
            explorerURL: `https://bscscan.com/address/${contract.address}`,
            metamaskURL: `https://metamask.app/token/add?address=${contract.address}&symbol=USDT&decimals=6&image=https%3A%2F%2Fraw.githubusercontent.com%2Ftrustwallet%2Fassets%2Fmaster%2Fblockchains%2Fethereum%2Fassets%2F0xdAC17F958D2ee523a2206206994597C13D831ec7%2Flogo.png`
        },
        educational_controls: {
            flashPeriodControl: "1 minute to 1 year",
            burnTimingControl: "0 hours to 1 week grace period",
            tradingControl: "Owner can enable/disable anytime",
            priceControl: "Internal oracle adjustable by owner",
            transferLimitControl: "Owner adjustable maximum",
            vipSystemControl: "Owner managed exemptions"
        },
        cost_analysis: {
            deploymentCost: "~$3 USD",
            liquidityRequired: "$0 (no DEX listing needed)",
            maintenanceCost: "$0 (GitHub Pages free)",
            totalCost: "~$3 USD only"
        }
    };
    
    // حفظ في ملف JSON
    const filename = `educational-deployment-v4.0-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 تم حفظ معلومات النشر في: ${filename}`);
    
    // تحديث price-api.json
    const priceApiPath = './public/price-api.json';
    if (fs.existsSync(priceApiPath)) {
        try {
            const priceApi = JSON.parse(fs.readFileSync(priceApiPath, 'utf8'));
            
            // تحديث عنوان العقد في tokens
            if (priceApi.tokens) {
                // إزالة العناوين القديمة
                priceApi.tokens = {};
                
                // إضافة العنوان الجديد
                priceApi.tokens[contract.address] = {
                    symbol: "USDT",
                    name: "Tether USD",
                    price: "1.00",
                    price_usd: 1.00,
                    price_change_24h: 0.0,
                    market_cap: 900000000,
                    volume_24h: 0,
                    circulating_supply: 900000000,
                    total_supply: 900000000,
                    max_supply: 900000000,
                    decimals: 6,
                    contract_address: contract.address,
                    blockchain: "binance-smart-chain",
                    chain_id: 56,
                    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
                    website: "https://tether.to",
                    explorer: `https://bscscan.com/token/${contract.address}`,
                    last_updated: new Date().toISOString(),
                    rank: 3,
                    tags: ["stablecoin", "bep20", "defi", "educational", "flash"],
                    description: "Ultimate Flash USDT v4.0 - Educational token for learning blockchain concepts",
                    status: "active",
                    educational_features: {
                        flash_minting: true,
                        dex_blocking: true,
                        vip_system: true,
                        owner_controls: true,
                        internal_price_oracle: true,
                        custom_burn_timing: true,
                        trading_control: true
                    },
                    price_sources: ["internal_oracle"],
                    trading_enabled: false,
                    educational_mode: true
                };
                
                priceApi.last_updated = new Date().toISOString();
            }
            
            fs.writeFileSync(priceApiPath, JSON.stringify(priceApi, null, 2));
            console.log("✅ تم تحديث price-api.json بالعنوان الجديد");
        } catch (error) {
            console.log("⚠️ خطأ في تحديث price-api.json:", error.message);
        }
    }
    
    // تحديث docs/index.html
    const docsIndexPath = './docs/index.html';
    if (fs.existsSync(docsIndexPath)) {
        try {
            let htmlContent = fs.readFileSync(docsIndexPath, 'utf8');
            
            // تحديث عنوان العقد في HTML
            htmlContent = htmlContent.replace(
                'سيتم تحديثه بعد النشر',
                contract.address
            );
            
            // تحديث JavaScript config
            htmlContent = htmlContent.replace(
                'address: "0x0000000000000000000000000000000000000000"',
                `address: "${contract.address}"`
            );
            
            fs.writeFileSync(docsIndexPath, htmlContent);
            console.log("✅ تم تحديث docs/index.html بالعنوان الجديد");
        } catch (error) {
            console.log("⚠️ خطأ في تحديث docs/index.html:", error.message);
        }
    }
    
    console.log("\n🎯 الخطوات التالية للمشروع التعليمي:");
    console.log("1. 🔍 تحقق من العقد على BSCScan");
    console.log("2. 🌐 ادفع التحديثات إلى GitHub لتفعيل GitHub Pages");
    console.log("3. 🎓 ابدأ استخدام العقد للأغراض التعليمية");
    console.log("4. 📱 اختبر إضافة التوكن في المحافظ");
    console.log("5. 🎛️ جرب جميع وظائف التحكم التعليمية");
    
    console.log("\n💰 تحليل التكلفة:");
    console.log("💸 تكلفة النشر: ~$3 USD فقط");
    console.log("🆓 استضافة GitHub Pages: مجاني");
    console.log("🆓 عدم الحاجة لسيولة DEX: مجاني");
    console.log("🆓 عدم الحاجة لتسجيل CoinGecko: مجاني");
    console.log("💡 إجمالي التكلفة: ~$3 USD فقط!");
    
    console.log("\n🎊 تم إنجاز النشر التعليمي بنجاح!");
    console.log("🎓 العقد جاهز للاستخدام التعليمي مع تحكم كامل للمالك");
    console.log("=" .repeat(70));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ خطأ في النشر:", error);
        process.exit(1);
    });
