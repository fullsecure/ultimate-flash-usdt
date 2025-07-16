require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Lower runs for cheaper deployment
      },
      viaIR: false, // Disable IR for simpler compilation
    },
  },
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 3000000000, // 3 Gwei بدلاً من 20 Gwei (توفير 85%)
      accounts: ["1f1a4b8ccbb1edda7cb290c08e6e92a56c94cc5ddda6b4de049470713c3e1473"]
    },
    bscMainnet: {
      url: "https://bsc-dataseed1.binance.org/",
      chainId: 56,
      gasPrice: 1000000000, // 1 Gwei - minimum possible for BSC
      accounts: ["1f1a4b8ccbb1edda7cb290c08e6e92a56c94cc5ddda6b4de049470713c3e1473"],
      timeout: 60000
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: "XM7I5IV2CAHX1TBT5VE2Y6Q5ATTX1GWE71",
      bsc: "XM7I5IV2CAHX1TBT5VE2Y6Q5ATTX1GWE71"
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
