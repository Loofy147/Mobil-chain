package com.example.aeamc

data class ProofOfTask(
    val taskId: String,
    val deviceId: String,
    val timestamp: Long,
    val outputDigest: String,
    val checkpoint: String,
    val executionMetadata: ExecutionMetadata,
    val signature: String
)

data class ExecutionMetadata(
    val executionTimeMs: Int,
    val cpuCycles: Int
)

data class ProofOfAvailability(
    val deviceId: String,
    val timestamp: Long,
    val signature: String
)
