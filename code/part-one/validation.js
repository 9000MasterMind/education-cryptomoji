'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');

/**
 * A simple validation function for transactions. Accepts a transaction
 * and returns true or false. It should reject transactions that:
 *   - have negative amounts
 *   - were improperly signed
 *   - have been modified since signing
 */
const isValidTransaction = transaction => {
  // Enter your solution here
  if (transaction.amount <= 0 ||
    transaction.signature.length !== 128 ||
    transaction.source.length !== 66 ||
    transaction.recipient.length !== 66
  ) {
    return false;
  }
  return signing.verify(transaction.source, `${transaction.source}${transaction.recipient}${transaction.amount}`, transaction.signature);
};

/**
 * Validation function for blocks. Accepts a block and returns true or false.
 * It should reject blocks if:
 *   - their hash or any other properties were altered
 *   - they contain any invalid transactions
 */
const isValidBlock = block => {
  // Your code here
  let temp = block.hash
  if (temp !== block.calculateHash(block.nonce)) {
    block.hash = temp;
    return false;
  }
  for (let i = 0; i < block.transactions.length; i++) {
    if (!isValidTransaction(block.transactions[i])) return false;
  }
  return true;
};

/**
 * One more validation function. Accepts a blockchain, and returns true
 * or false. It should reject any blockchain that:
 *   - is missing a genesis block
 *   - has any block besides genesis with a null hash
 *   - has any block besides genesis with a previousHash that does not match
 *     the previous hash 
 *   - contains any invalid blocks
 *   - contains any invalid transactions
 */
const isValidChain = blockchain => {
  // Your Awesome code here
  if (blockchain.blocks[0].previousHash !== null || blockchain.blocks[0].transactions.length !== 0) return false;
  for (let i = 1; i < blockchain.blocks.length; i++) {
    if (blockchain.blocks[i].hash === null ||
      blockchain.blocks[i].previousHash !== blockchain.blocks[i - 1].hash || !isValidBlock(blockchain.blocks[i])) return false;
  }

  return true;
};

/**
 * This last one is just for fun. Become a hacker and tamper with the passed in
 * blockchain, mutating it for your own nefarious purposes. This should
 * (in theory) make the blockchain fail later validation checks;
 */
const breakChain = blockchain => {
  // Your code here
  // const signer = signing.createPrivateKey();
  // const recipient = signing.getPublicKey(signing.createPrivateKey());
  // const amount = Math.ceil(Math.random() * 100);
  // const newTransaction = new Transaction(signer, recipient, amount);
  blockchain.blocks = [blockchain.blocks[0]];
  // blockchain.blocks.pop();
  // blockchain.addBlock([{source: 'you', recipient: 'me', amount: 1000000, signature: 'trust me, its real'}])
};

module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};
