package com.example.aeamc

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.security.KeyPairGenerator
import java.security.KeyStore
import java.security.MessageDigest
import java.security.PrivateKey
import java.security.Signature
import java.util.Base64

class ProofGenerator(private val deviceId: String) {

    private val keyStore: KeyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
    private val keyAlias = "aeamc_signing_key"

    init {
        // Generate a key pair if it doesn't already exist
        if (!keyStore.containsAlias(keyAlias)) {
            generateKeyPair()
        }
    }

    private fun generateKeyPair() {
        val keyPairGenerator = KeyPairGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_EC,
            "AndroidKeyStore"
        )
        val parameterSpec = KeyGenParameterSpec.Builder(
            keyAlias,
            KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY
        ).run {
            setDigests(KeyProperties.DIGEST_SHA256)
            setAlgorithmParameterSpec(android.security.keystore.ECGenParameterSpec("secp256r1"))
            setUserAuthenticationRequired(false) // For background operations
            build()
        }
        keyPairGenerator.initialize(parameterSpec)
        keyPairGenerator.generateKeyPair()
    }

    private fun getPrivateKey(): PrivateKey {
        val entry = keyStore.getEntry(keyAlias, null) as? KeyStore.PrivateKeyEntry
        return entry?.privateKey ?: throw IllegalStateException("Private key not found.")
    }

    fun generateProof(taskResult: TaskResult): ProofOfTask {
        val timestamp = System.currentTimeMillis()
        val outputDigest = hashString(taskResult.resultData)

        // Data to be signed
        val message = "${taskResult.taskId}${deviceId}${timestamp}${outputDigest}"
        val signatureBytes = signData(message)
        val signature = Base64.getEncoder().encodeToString(signatureBytes)

        return ProofOfTask(
            taskId = taskResult.taskId,
            deviceId = deviceId,
            timestamp = timestamp,
            outputDigest = outputDigest,
            checkpoint = "dummy_checkpoint", // Placeholder
            executionMetadata = ExecutionMetadata(
                executionTimeMs = taskResult.executionTimeMs,
                cpuCycles = taskResult.cpuCycles
            ),
            signature = signature
        )
    }

    private fun signData(data: String): ByteArray {
        val privateKey = getPrivateKey()
        val signature = Signature.getInstance("SHA256withECDSA").apply {
            initSign(privateKey)
            update(data.toByteArray())
        }
        return signature.sign()
    }

    private fun hashString(input: String): String {
        return MessageDigest
            .getInstance("SHA-256")
            .digest(input.toByteArray())
            .fold("") { str, it -> str + "%02x".format(it) }
    }
}
