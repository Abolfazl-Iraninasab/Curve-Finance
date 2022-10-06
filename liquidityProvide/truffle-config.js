
module.exports = {

  networks: {

    mainnetFork: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "999",       // Any network (default: none)
    },
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.13",      // Fetch exact version from solc-bin (default: truffle's version)

    }
  },
};
