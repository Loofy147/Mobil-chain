package com.example.aeamc

import java.security.MessageDigest

class ProofGenerator(private val deviceId: String) {

    fun generateProof(taskResult: TaskResult): ProofOfTask {
        val timestamp = System.currentTimeMillis()
        val outputDigest = hashString(taskResult.resultData)

        return ProofOfTask(
            taskId = taskResult.taskId,
            deviceId = deviceId,
            timestamp = timestamp,
            outputDigest = outputDigest,
            checkpoint = "dummy_checkpoint", // Placeholder
            executionMetadata = ExecutionMetadata(
                executionTimeMs = 1000, // Placeholder
                cpuCycles = 5000000 // Placeholder
            ),
            signature = "dummy_signature" // Placeholder
        )
    }

    private fun hashString(input: String): String {
        return MessageDigest
            .getInstance("SHA-256")
            .digest(input.toByteArray())
            .fold("") { str, it -> str + "%02x".format(it) }
    }
}
