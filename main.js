const { SHA256 } = require('crypto-js');

////  def Transaction
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}



////  Def Block 
class Block {
  constructor(timestamp, transactions, previousHash='') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = '';
    this.nonce = 0;
  }

  //// function
  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  ////  create difficulty
  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('Block mined: ' + this.hash)
  }
}

////  Def Blockchain
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock]; //// init chain
    this.difficulty = 3;
    this.pendingTransaction = [];
    this.miningReward = 50;
  }

  //// init first block on chain 
  createGenesisBlock() {
    return new Block('2/11/2019', 'Genesis block', '0');
  }

  //// Get newest block
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  //// add to end of block
  // addBlock(newBlock) {
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   newBlock.mineBlock(this.difficulty);
  //   // newBlock.hash = newBlock.calculateHash();
  //   this.chain.push(newBlock);
  // }

  ////    
  minePendingTransactions(miningRewardAdress) {
    const block = new Block(Date.now(), this.pendingTransaction);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mine:');
    this.chain.push(block);
    this.pendingTransaction = [new Transaction(null, miningRewardAdress, this.miningReward)];
  }

  ////
  createTransaction(transaction) {
    this.pendingTransaction.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for(let block of this.chain) {
      console.log('86',block)
      // for(let trans of block.transactions) {

      //   if(trans.fromAddress === address) {
      //     balance -= trans.amount;
      //   } else if(trans.toAddress === address) {
      //     balance += trans.amount;
      //   }
      // }
    }

    return balance;
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

console.log(`Mined block1...`)
// vuCoin.addBlock(new Block(1, '2/12/2019', { amount: 10 }));

vuCoin.createTransaction(new Transaction('address1', 'address2', 100))
vuCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log('Stating the miner..')
vuCoin.minePendingTransactions('vu-address')

console.log(`Balance of vu is ${ vuCoin.getBalanceOfAddress('vu-address') }`);


console.log(`Mined block2...`)
// vuCoin.addBlock(new Block(2, '2/13/2019', { amount: 20 }));

console.log('Stating the miner again..')
vuCoin.minePendingTransactions('vu-address')

console.log(`Balance of vu is ${ vuCoin.getBalanceOfAddress('vu-address') }`);

// console.log(JSON.stringify(vuCoin, null, 4));
console.log('is blockchain valid:', vuCoin.isChainValid());