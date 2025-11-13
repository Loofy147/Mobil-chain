// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MicroblockAnchor {
    struct Microblock {
        bytes32 hash;
        uint256 timestamp;
        uint256 blockNumber;
        address submitter;
    }

    Microblock[] public microblocks;
    mapping(bytes32 => uint256) public hashToIndex;

    event MicroblockAnchored(
        bytes32 indexed hash,
        uint256 timestamp,
        uint256 blockNumber,
        address submitter
    );

    /**
     * Anchor a microblock digest
     */
    function anchorBlock(bytes32 _hash, uint256 _timestamp) external {
        require(hashToIndex[_hash] == 0, "Already anchored");

        microblocks.push(Microblock({
            hash: _hash,
            timestamp: _timestamp,
            blockNumber: block.number,
            submitter: msg.sender
        }));

        hashToIndex[_hash] = microblocks.length;

        emit MicroblockAnchored(_hash, _timestamp, block.number, msg.sender);
    }

    /**
     * Verify a microblock was anchored
     */
    function verifyAnchor(bytes32 _hash) external view returns (bool, uint256, uint256) {
        uint256 index = hashToIndex[_hash];
        if (index == 0) {
            return (false, 0, 0);
        }

        Microblock memory mb = microblocks[index - 1];
        return (true, mb.timestamp, mb.blockNumber);
    }

    /**
     * Get total anchored blocks
     */
    function getCount() external view returns (uint256) {
        return microblocks.length;
    }
}