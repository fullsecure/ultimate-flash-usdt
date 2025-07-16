const { ethers } = require("hardhat");

async function main() {
    console.log("💧 إعداد سيولة اقتصادية لـ Flash USDT");
    console.log("=" .repeat(50));
    
    // عنوان العقد (سيتم تحديثه بعد النشر)
    const CONTRACT_ADDRESS = "0x99f97c023D64435c61c92Ad129C73549D0446f3E";
    
    // عناوين PancakeSwap
    const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
    const WBNB = "0xbb4CdB9CBd36B01bD1cBaeBF2De08d9173bc095c";
    
    const [deployer] = await ethers.getSigners();
    console.log("👤 المنشر:", deployer.address);
    
    const balance = await deployer.getBalance();
    console.log("💰 رصيد BNB:", ethers.utils.formatEther(balance));
    
    // الحد الأدنى للسيولة - $50 فقط!
    const MINIMAL_LIQUIDITY = {
        usdt: ethers.utils.parseUnits("50", 6),      // 50 USDT
        bnb: ethers.utils.parseEther("0.075")        // 0.075 BNB (~$50)
    };
    
    console.log("\n📊 خطة السيولة الاقتصادية:");
    console.log("💵 USDT المطلوب:", ethers.utils.formatUnits(MINIMAL_LIQUIDITY.usdt, 6));
    console.log("🟡 BNB المطلوب:", ethers.utils.formatEther(MINIMAL_LIQUIDITY.bnb));
    console.log("💰 التكلفة الإجمالية: ~$50 USD");
    
    // التحقق من الرصيد
    if (balance.lt(MINIMAL_LIQUIDITY.bnb.add(ethers.utils.parseEther("0.01")))) {
        console.log("❌ رصيد BNB غير كافي");
        console.log("💡 مطلوب:", ethers.utils.formatEther(MINIMAL_LIQUIDITY.bnb.add(ethers.utils.parseEther("0.01"))), "BNB");
        return;
    }
    
    // الحصول على عقد التوكن
    const tokenABI = [
        "function balanceOf(address) view returns (uint256)",
        "function approve(address, uint256) returns (bool)",
        "function transfer(address, uint256) returns (bool)"
    ];
    
    const token = new ethers.Contract(CONTRACT_ADDRESS, tokenABI, deployer);
    
    // فحص رصيد التوكن
    const tokenBalance = await token.balanceOf(deployer.address);
    console.log("🪙 رصيد USDT:", ethers.utils.formatUnits(tokenBalance, 6));
    
    if (tokenBalance.lt(MINIMAL_LIQUIDITY.usdt)) {
        console.log("❌ رصيد USDT غير كافي");
        console.log("💡 مطلوب:", ethers.utils.formatUnits(MINIMAL_LIQUIDITY.usdt, 6), "USDT");
        return;
    }
    
    // Router ABI (مبسط)
    const routerABI = [
        "function addLiquidityETH(address,uint256,uint256,uint256,address,uint256) payable returns (uint256,uint256,uint256)"
    ];
    
    const router = new ethers.Contract(PANCAKE_ROUTER, routerABI, deployer);
    
    console.log("\n🔄 بدء إضافة السيولة...");
    
    try {
        // الموافقة على إنفاق التوكنات
        console.log("✅ الموافقة على إنفاق USDT...");
        const approveTx = await token.approve(PANCAKE_ROUTER, MINIMAL_LIQUIDITY.usdt);
        await approveTx.wait();
        console.log("✅ تم الموافقة على الإنفاق");
        
        // إضافة السيولة
        console.log("💧 إضافة السيولة إلى PancakeSwap...");
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 دقيقة
        
        const addLiquidityTx = await router.addLiquidityETH(
            CONTRACT_ADDRESS,
            MINIMAL_LIQUIDITY.usdt,
            0, // slippage tolerance
            0, // slippage tolerance  
            deployer.address,
            deadline,
            { value: MINIMAL_LIQUIDITY.bnb }
        );
        
        console.log("⏳ انتظار تأكيد المعاملة...");
        const receipt = await addLiquidityTx.wait();
        
        console.log("✅ تم إضافة السيولة بنجاح!");
        console.log("🔗 معرف المعاملة:", receipt.transactionHash);
        console.log("🔗 PancakeSwap:", `https://pancakeswap.finance/info/pairs/bsc/${CONTRACT_ADDRESS}`);
        
        // حفظ معلومات السيولة
        const liquidityInfo = {
            contract_address: CONTRACT_ADDRESS,
            transaction_hash: receipt.transactionHash,
            usdt_amount: ethers.utils.formatUnits(MINIMAL_LIQUIDITY.usdt, 6),
            bnb_amount: ethers.utils.formatEther(MINIMAL_LIQUIDITY.bnb),
            total_cost_usd: 50,
            timestamp: new Date().toISOString(),
            pancakeswap_url: `https://pancakeswap.finance/info/pairs/bsc/${CONTRACT_ADDRESS}`,
            purpose: "Minimal liquidity for price display in wallets"
        };
        
        console.log("\n📋 معلومات السيولة:");
        console.log(JSON.stringify(liquidityInfo, null, 2));
        
    } catch (error) {
        console.error("❌ خطأ في إضافة السيولة:", error.message);
        
        if (error.message.includes("insufficient")) {
            console.log("💡 نصيحة: تأكد من وجود رصيد كافي من BNB و USDT");
        }
        
        if (error.message.includes("allowance")) {
            console.log("💡 نصيحة: تأكد من الموافقة على إنفاق التوكنات");
        }
    }
    
    console.log("\n🎯 الخطوات التالية:");
    console.log("1. 🔍 تحقق من السيولة على PancakeSwap");
    console.log("2. 📱 اختبر عرض السعر في Trust Wallet");
    console.log("3. 🦊 اختبر عرض السعر في MetaMask");
    console.log("4. 🔒 اقفل السيولة إذا لزم الأمر");
    
    console.log("\n💰 تحليل التكلفة النهائي:");
    console.log("💸 نشر العقد: ~$3");
    console.log("💧 إضافة سيولة: ~$50");
    console.log("🆓 استضافة GitHub Pages: مجاني");
    console.log("💡 إجمالي التكلفة: ~$53 فقط!");
    
    console.log("\n🎊 مهمة السيولة الاقتصادية مكتملة!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ خطأ:", error);
        process.exit(1);
    });
