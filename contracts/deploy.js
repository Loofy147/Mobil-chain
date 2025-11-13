const { ethers } = require('hardhat');

async function main() {
    console.log('Deploying MicroblockAnchor contract...');

    const MicroblockAnchor = await ethers.getContractFactory('MicroblockAnchor');
    const anchor = await MicroblockAnchor.deploy();
    await anchor.deployed();

    console.log(`✅ Contract deployed to: ${anchor.address}`);
    console.log(`\nAdd this to your coordinator config:`);
    console.log(`ANCHOR_ADDRESS="${anchor.address}"`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });