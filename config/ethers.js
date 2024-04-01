const { ethers } = require("ethers");
const provider_infura ="wss://sepolia.infura.io/ws/v3/7409a09023ba4a9ebd10e0875f9ff079";
const provider_VB = "https://vibi.vbchain.vn/";
const provider_MBC = "https://mbctest.vbchain.vn/VBCinternship2023"
const provider_BSC = "https://bsc-mainnet.nodereal.io/v1/ff851b38f08c4cd9a06052692cd45eb3"

var eth =  new ethers.providers.JsonRpcProvider(provider_VB);;



module.exports = ethers