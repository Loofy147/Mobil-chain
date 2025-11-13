const crypto = require('crypto');
const { Web3 } = require('web3');

class MicroblockService {
    constructor() {
        this.pendingReceipts = [];
        this.microblocks = [];
        this.blockInterval = 60000; // 1 minute

        // Ethereum connection (testnet)
        this.web3 = new Web3('https://sepolia.infura.io/v3/YOUR_KEY');
        this.anchorContract = new this.web3.eth.Contract(
            ANCHOR_ABI,
            ANCHOR_ADDRESS
        );

        setInterval(() => this.formMicroblock(), this.blockInterval);
    }

    /**
     * Verify PoT using deterministic re-challenge
     */
    verifyProof(pot) {
        // 1. Verify signature
        const message = `${pot.taskId}${pot.deviceId}${pot.timestamp}${pot.outputDigest}`;
        const isValidSig = this.verifySignature(message, pot.signature, pot.deviceId);

        if (!isValidSig) {
            return { valid: false, reason: 'Invalid signature' };
        }

        // 2. Check timestamp freshness
        const age = Date.now() - pot.timestamp;
        if (age > 300000) { // 5 minutes
            return { valid: false, reason: 'Proof expired' };
        }

        // 3. Deterministic spot-check
        const latestBlock = this.microblocks[this.microblocks.length - 1];
        const blockDigest = latestBlock ? latestBlock.hash : '0x0';

        const seed = crypto.createHmac('sha256', 'cluster_key_placeholder')
            .update(`${blockDigest}${pot.taskId}`)
            .digest('hex');

        // Use seed to select random indices for verification
        const checkIndex = parseInt(seed.substring(0, 8), 16) % 100;

        // In production: request device to re-compute specific checkpoint
        // For now: accept if checkpoint format is valid
        if (!pot.checkpoint || pot.checkpoint === 'dummy_checkpoint') {
            return { valid: false, reason: 'Invalid checkpoint' };
        }

        return { valid: true, spotCheckIndex: checkIndex };
    }

    /**
     * Add verified receipt to pending pool
     */
    addReceipt(pot) {
        const verification = this.verifyProof(pot);

        if (!verification.valid) {
            console.log(`❌ Proof rejected: ${verification.reason}`);
            return { accepted: false, reason: verification.reason };
        }

        this.pendingReceipts.push({
            pot,
            verifiedAt: Date.now(),
            spotCheckIndex: verification.spotCheckIndex
        });

        console.log(`✅ Proof accepted: ${pot.taskId} (${this.pendingReceipts.length} pending)`);
        return { accepted: true };
    }

    /**
     * Form microblock from pending receipts
     */
    formMicroblock() {
        if (this.pendingReceipts.length === 0) {
            console.log('No receipts to form microblock');
            return null;
        }

        const receipts = this.pendingReceipts.splice(0); // Take all pending

        const header = {
            magic: 0xAEAEAEAE,
            version: 1,
            clusterId: 1,
            timestamp: Date.now(),
            receiptCount: receipts.length,
            previousHash: this.microblocks.length > 0
                ? this.microblocks[this.microblocks.length - 1].hash
                : '0x0'
        };

        const payloadHash = crypto.createHash('sha256')
            .update(JSON.stringify(receipts))
            .digest('hex');

        header.payloadHash = payloadHash;

        const blockHash = crypto.createHash('sha256')
            .update(JSON.stringify(header))
            .digest('hex');

        const microblock = {
            header,
            receipts,
            hash: blockHash,
            anchored: false
        };

        this.microblocks.push(microblock);

        console.log(`📦 Microblock formed: ${blockHash.substring(0, 16)}... (${receipts.length} receipts)`);

        // Anchor to blockchain
        this.anchorMicroblock(microblock);

        return microblock;
    }

    /**
     * Anchor microblock digest to Ethereum testnet
     */
    async anchorMicroblock(microblock) {
        try {
            const account = this.web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

            const tx = await this.anchorContract.methods
                .anchorBlock(microblock.hash, microblock.header.timestamp)
                .send({ from: account.address, gas: 100000 });

            microblock.anchored = true;
            microblock.anchorTx = tx.transactionHash;

            console.log(`⚓ Anchored to Ethereum: ${tx.transactionHash}`);
        } catch (error) {
            console.error('Anchoring failed:', error);
        }
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            totalMicroblocks: this.microblocks.length,
            pendingReceipts: this.pendingReceipts.length,
            totalReceipts: this.microblocks.reduce((sum, b) => sum + b.receipts.length, 0),
            anchored: this.microblocks.filter(b => b.anchored).length
        };
    }
}

module.exports = MicroblockService;