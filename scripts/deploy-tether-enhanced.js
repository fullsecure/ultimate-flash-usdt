// Deploy TetherUSDEnhanced Contract
// Professional deployment script for the official Tether USD Enhanced contract

const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying TetherUSDEnhanced Contract...");
    console.log("=====================================");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.getBalance();
    console.log("💰 Account balance:", hre.ethers.utils.formatEther(balance), "BNB");

    // Deploy contract
    const TetherUSDEnhanced = await hre.ethers.getContractFactory("TetherUSDEnhanced");
    console.log("📦 Deploying contract...");
    
    const contract = await TetherUSDEnhanced.deploy();
    await contract.deployed();

    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract address:", contract.address);
    console.log("🔗 BSCScan URL:", `https://bscscan.com/address/${contract.address}`);

    // Verify contract details
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const totalSupply = await contract.totalSupply();
    const ownerBalance = await contract.balanceOf(deployer.address);

    console.log("\n📊 Contract Details:");
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Decimals:", decimals);
    console.log("Total Supply:", hre.ethers.utils.formatUnits(totalSupply, decimals), symbol);
    console.log("Owner Balance:", hre.ethers.utils.formatUnits(ownerBalance, decimals), symbol);
    console.log("Owner Value: $" + hre.ethers.utils.formatUnits(ownerBalance, decimals));

    // Save deployment info
    const deploymentInfo = {
        contractName: "TetherUSDEnhanced",
        contractAddress: contract.address,
        deployer: deployer.address,
        network: hre.network.name,
        blockNumber: contract.deployTransaction.blockNumber,
        transactionHash: contract.deployTransaction.hash,
        gasUsed: contract.deployTransaction.gasLimit.toString(),
        timestamp: new Date().toISOString(),
        tokenDetails: {
            name: name,
            symbol: symbol,
            decimals: decimals,
            totalSupply: totalSupply.toString(),
            ownerBalance: ownerBalance.toString()
        }
    };

    console.log("\n💾 Deployment completed successfully!");
    console.log("📋 Ready for BSCScan verification");
    
    return deploymentInfo;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
