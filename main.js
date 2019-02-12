const {SHA256} = require('crypto-js');

////  Def Block 
class Block {
  constructor(index, timestamp, data, previousHash='') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = '';
  }

  //// function
  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

////  Def Blockchain
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock]; //// init chain
  }

  //// init first block on chain 
  createGenesisBlock() {
    return new Block(0, '2/11/2019', 'Genesis block', '0');
  }

  //// Get newest block
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  //// add to end of block
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  //// check if chain is valid
  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      let currentBlock = this.chain[i];
      let previousHash = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      } else if(currentBlock.previousHash !== previousHash.hash) {
        return false
      }
    } 

    return true
  }
}

const vuCoin = new Blockchain();

vuCoin.addBlock(new Block(1, '2/12/2019', { amount: 10 }));
vuCoin.addBlock(new Block(2, '2/13/2019', { amount: 20 }));

// console.log(JSON.stringify(vuCoin, null, 4));
console.log('is blockchain valid:', vuCoin.isChainValid());