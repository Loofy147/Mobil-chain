const crypto = require('crypto');
const { Web3 } = require('web3');
const db = require('./database');

class MicroblockService {
    constructor() {
        this.pendingReceipts = [];
        this.blockInterval = 60000; // 1 minute

        // Ethereum connection (testnet) - ABI and ADDRESS would be loaded from a config
        this.web3 = new Web3('https://sepolia.infura.io/v3/YOUR_KEY');
        // this.anchorContract = new this.web3.eth.Contract(
        //     ANCHOR_ABI,
        //     ANCHOR_ADDRESS
        // );

        setInterval(() => this.formMicroblock(), this.blockInterval);
    }

    async getLatestBlock() {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM microblocks ORDER BY json_extract(header, '$.timestamp') DESC LIMIT 1", (err, row) => {
                if (err) {
                    console.error("Error fetching latest block:", err);
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    /**
     * Verify PoT using deterministic re-challenge
     */
    async verifyProof(pot) {
        // 1. Verify signature (assuming a dummy verification for now)
        const isValidSig = true; // this.verifySignature(message, pot.signature, pot.deviceId);

        if (!isValidSig) {
            return { valid: false, reason: 'Invalid signature' };
        }

        // 2. Check timestamp freshness
        const age = Date.now() - pot.timestamp;
        if (age > 300000) { // 5 minutes
            return { valid: false, reason: 'Proof expired' };
        }

        // 3. Deterministic spot-check
        const latestBlock = await this.getLatestBlock();
        const blockDigest = latestBlock ? latestBlock.hash : '0x0';

        const seed = crypto.createHmac('sha256', 'cluster_key_placeholder')
            .update(`${blockDigest}${pot.taskId}`)
            .digest('hex');

        const checkIndex = parseInt(seed.substring(0, 8), 16) % 100;

        if (!pot.checkpoint || pot.checkpoint === 'dummy_checkpoint') {
            return { valid: false, reason: 'Invalid checkpoint' };
        }

        return { valid: true, spotCheckIndex: checkIndex };
    }

    /**
     * Add verified receipt to pending pool
     */
    async addReceipt(pot) {
        const verification = await this.verifyProof(pot);

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
    async formMicroblock() {
        if (this.pendingReceipts.length === 0) {
            return;
        }

        const receipts = this.pendingReceipts.splice(0);
        const latestBlock = await this.getLatestBlock();

        const header = {
            magic: 0xAEAEAEAE,
            version: 1,
            clusterId: 1,
            timestamp: Date.now(),
            receiptCount: receipts.length,
            previousHash: latestBlock ? latestBlock.hash : '0x0'
        };

        const payloadHash = crypto.createHash('sha256').update(JSON.stringify(receipts)).digest('hex');
        header.payloadHash = payloadHash;

        const blockHash = crypto.createHash('sha256').update(JSON.stringify(header)).digest('hex');

        const microblock = {
            header,
            receipts,
            hash: blockHash,
            anchored: false
        };

        const stmt = db.prepare('INSERT INTO microblocks (hash, header, receipts, anchored) VALUES (?, ?, ?, ?)');
        stmt.run(
            microblock.hash,
            JSON.stringify(microblock.header),
            JSON.stringify(microblock.receipts),
            0
        );
        stmt.finalize();

        console.log(`📦 Microblock formed and saved: ${blockHash.substring(0, 16)}...`);

        // this.anchorMicroblock(microblock);
    }

    /**
     * Anchor microblock digest to Ethereum testnet
     */
    async anchorMicroblock(microblock) {
        try {
            // ... (omitting actual web3 call for now) ...
            console.log(`⚓ Anchoring to Ethereum (simulation)...`);

            const anchorTx = `0x${crypto.randomBytes(32).toString('hex')}`;

            db.run(
                'UPDATE microblocks SET anchored = 1, anchorTx = ? WHERE hash = ?',
                [anchorTx, microblock.hash]
            );

            console.log(`   tx: ${anchorTx}`);

        } catch (error) {
            console.error('Anchoring failed:', error);
        }
    }

    /**
     * Get statistics
     */
    async getStats() {
        const totalMicroblocks = await new Promise((res) => db.get('SELECT COUNT(*) as count FROM microblocks', (err, row) => res(row.count)));
        const anchoredBlocks = await new Promise((res) => db.get('SELECT COUNT(*) as count FROM microblocks WHERE anchored = 1', (err, row) => res(row.count)));

        return {
            totalMicroblocks,
            pendingReceipts: this.pendingReceipts.length,
            anchored: anchoredBlocks
        };
    }
}

module.exports = MicroblockService;
