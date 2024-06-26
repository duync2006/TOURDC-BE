const { Web3 } = require('web3');
const infuraProvider = "https://sepolia.infura.io/v3/185ca6c54cdb438b977b428d45017f05"
const provider_VB = "https://vibi.vbchain.vn/";
const provider_MBC = "https://mbctest.vbchain.vn/VBCinternship2023"
const provider_BSC = "https://bsc-mainnet.nodereal.io/v1/ff851b38f08c4cd9a06052692cd45eb3"

var web3 = new Web3(infuraProvider);

web3.eth.extend({
  property: 'txpool',
  methods: [{
    name: 'content',
    call: 'txpool_content'
  },{
    name: 'inspect',
    call: 'txpool_inspect'
  },{
    name: 'status',
    call: 'txpool_status'
  }]
})

module.exports = web3