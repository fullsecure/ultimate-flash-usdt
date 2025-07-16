const https = require('https');

async function checkContractOnBSCScan() {
    console.log("🔍 Checking Contract on BSCScan");
    console.log("=" .repeat(40));
    
    const contractAddress = "0x99f97c023D64435c61c92Ad129C73549D0446f3E";
    const apiKey = "XM7I5IV2CAHX1TBT5VE2Y6Q5ATTX1GWE71";
    
    console.log("📋 Contract Address:", contractAddress);
    
    try {
        // Check contract source code
        const sourceUrl = `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
        
        console.log("\n🔍 Checking contract source...");
        const sourceData = await makeRequest(sourceUrl);
        
        if (sourceData.status === "1" && sourceData.result[0].SourceCode) {
            console.log("✅ Contract source code found");
            console.log("   Contract Name:", sourceData.result[0].ContractName);
            console.log("   Compiler Version:", sourceData.result[0].CompilerVersion);
            console.log("   Optimization:", sourceData.result[0].OptimizationUsed === "1" ? "Enabled" : "Disabled");
        } else {
            console.log("⚠️ Contract source code not verified yet");
        }
        
        // Check contract ABI
        const abiUrl = `https://api.bscscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
        
        console.log("\n🔍 Checking contract ABI...");
        const abiData = await makeRequest(abiUrl);
        
        if (abiData.status === "1") {
            console.log("✅ Contract ABI found");
            const abi = JSON.parse(abiData.result);
            console.log("   Functions count:", abi.filter(item => item.type === 'function').length);
            console.log("   Events count:", abi.filter(item => item.type === 'event').length);
        } else {
            console.log("⚠️ Contract ABI not available");
        }
        
        // Check basic contract info
        const balanceUrl = `https://api.bscscan.com/api?module=account&action=balance&address=${contractAddress}&tag=latest&apikey=${apiKey}`;
        
        console.log("\n🔍 Checking contract balance...");
        const balanceData = await makeRequest(balanceUrl);
        
        if (balanceData.status === "1") {
            const balance = parseInt(balanceData.result) / 1e18;
            console.log("✅ Contract balance:", balance, "BNB");
        }
        
        // Check transaction count
        const txCountUrl = `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionCount&address=${contractAddress}&tag=latest&apikey=${apiKey}`;
        
        console.log("\n🔍 Checking transaction count...");
        const txCountData = await makeRequest(txCountUrl);
        
        if (txCountData.result) {
            const txCount = parseInt(txCountData.result, 16);
            console.log("✅ Transaction count:", txCount);
        }
        
        // Check if contract is verified
        console.log("\n📊 Contract Status Summary:");
        console.log("=" .repeat(30));
        console.log("📋 Address:", contractAddress);
        console.log("🌐 Network: BSC Mainnet");
        console.log("🔗 BSCScan:", `https://bscscan.com/address/${contractAddress}`);
        
        if (sourceData.status === "1" && sourceData.result[0].SourceCode) {
            console.log("✅ Source Code: Verified");
            console.log("✅ Contract Name:", sourceData.result[0].ContractName);
        } else {
            console.log("⚠️ Source Code: Not verified");
        }
        
        if (abiData.status === "1") {
            console.log("✅ ABI: Available");
        } else {
            console.log("⚠️ ABI: Not available");
        }
        
        // Generate integration URLs
        console.log("\n🔗 Integration URLs:");
        console.log("📱 MetaMask Add:");
        console.log(`   https://metamask.app/token/add?address=${contractAddress}&symbol=USDT&decimals=6`);
        
        console.log("📋 Trust Wallet Add:");
        console.log(`   https://link.trustwallet.com/add_asset?asset=c56_t${contractAddress}`);
        
        console.log("🔍 BSCScan:");
        console.log(`   https://bscscan.com/address/${contractAddress}`);
        
        console.log("📊 Token Info:");
        console.log(`   https://bscscan.com/token/${contractAddress}`);
        
        // Check if this is our expected contract
        const isOurContract = sourceData.result[0].ContractName === "UltimateFlashUSDTFixed";
        
        console.log("\n🎯 Verification Result:");
        if (isOurContract) {
            console.log("✅ This is our Ultimate Flash USDT v2.2 contract!");
        } else {
            console.log("⚠️ Contract name doesn't match expected");
        }
        
        // Generate final report
        const report = {
            contractAddress: contractAddress,
            network: "BSC Mainnet",
            timestamp: new Date().toISOString(),
            
            verification: {
                sourceCode: sourceData.status === "1" && sourceData.result[0].SourceCode ? "verified" : "not_verified",
                abi: abiData.status === "1" ? "available" : "not_available",
                contractName: sourceData.result[0]?.ContractName || "unknown"
            },
            
            links: {
                bscscan: `https://bscscan.com/address/${contractAddress}`,
                token: `https://bscscan.com/token/${contractAddress}`,
                metamask: `https://metamask.app/token/add?address=${contractAddress}&symbol=USDT&decimals=6`,
                trustwallet: `https://link.trustwallet.com/add_asset?asset=c56_t${contractAddress}`,
                netlify: "https://benevolent-longma-082868.netlify.app"
            },
            
            status: isOurContract ? "confirmed" : "needs_verification"
        };
        
        // Save report
        const fs = require('fs');
        fs.writeFileSync(
            'bscscan-verification-report.json',
            JSON.stringify(report, null, 2)
        );
        console.log("\n💾 Report saved to bscscan-verification-report.json");
        
        return {
            success: true,
            report: report
        };
        
    } catch (error) {
        console.error("💥 Error checking contract:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Execute check
if (require.main === module) {
    checkContractOnBSCScan()
        .then((result) => {
            if (result.success) {
                console.log("\n🎉 BSCScan check completed!");
                if (result.report.status === "confirmed") {
                    console.log("✅ Contract confirmed and ready!");
                } else {
                    console.log("⚠️ Contract needs verification");
                }
            } else {
                console.log("\n💥 BSCScan check failed!");
            }
        })
        .catch((error) => {
            console.error("💥 Unexpected error:", error);
        });
}

module.exports = checkContractOnBSCScan;
