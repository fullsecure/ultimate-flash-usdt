const { run } = require("hardhat");

async function verifyOnBSCScan() {
    console.log("🔍 Verifying Contract on BSCScan");
    console.log("=" .repeat(40));
    
    const contractAddress = "0x99f97c023D64435c61c92Ad129C73549D0446f3E";
    console.log("📋 Contract Address:", contractAddress);
    console.log("🌐 Network: BSC Mainnet");
    
    try {
        console.log("\n⏳ Starting verification process...");
        
        // Verify the contract
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: [], // No constructor arguments for our contract
            contract: "contracts/UltimateFlashUSDTFixed.sol:UltimateFlashUSDTFixed"
        });
        
        console.log("\n✅ Contract verification completed!");
        console.log("🔗 BSCScan:", `https://bscscan.com/address/${contractAddress}#code`);
        
        return {
            success: true,
            contractAddress: contractAddress,
            verificationUrl: `https://bscscan.com/address/${contractAddress}#code`
        };
        
    } catch (error) {
        console.error("💥 Verification failed:", error.message);
        
        if (error.message.includes("already verified")) {
            console.log("✅ Contract is already verified!");
            return {
                success: true,
                contractAddress: contractAddress,
                alreadyVerified: true,
                verificationUrl: `https://bscscan.com/address/${contractAddress}#code`
            };
        }
        
        console.log("\n🔧 Manual verification steps:");
        console.log("1. Go to https://bscscan.com/verifyContract");
        console.log("2. Enter contract address:", contractAddress);
        console.log("3. Select compiler: Solidity (Single file)");
        console.log("4. Select version: v0.8.19+commit.7dd6d404");
        console.log("5. Select license: MIT");
        console.log("6. Upload the contract source code");
        console.log("7. Enable optimization: Yes (200 runs)");
        
        return {
            success: false,
            error: error.message,
            contractAddress: contractAddress,
            manualSteps: true
        };
    }
}

// Execute verification
if (require.main === module) {
    verifyOnBSCScan()
        .then((result) => {
            if (result.success) {
                console.log("\n🎉 VERIFICATION SUCCESS!");
                if (result.alreadyVerified) {
                    console.log("✅ Contract was already verified");
                } else {
                    console.log("✅ Contract verification completed");
                }
                console.log("🔗 View verified contract:", result.verificationUrl);
            } else {
                console.log("\n⚠️ AUTOMATIC VERIFICATION FAILED");
                console.log("📝 Use manual verification steps above");
            }
        })
        .catch((error) => {
            console.error("💥 Unexpected error:", error);
        });
}

module.exports = verifyOnBSCScan;
