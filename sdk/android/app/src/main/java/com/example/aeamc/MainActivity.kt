package com.example.aeamc

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val telemetryManager = TelemetryManager(this)
        val telemetryData = telemetryManager.getTelemetryData()
        val deviceId = telemetryData.deviceId

        Log.d("MainActivity", "Telemetry Data: $telemetryData")

        CoroutineScope(Dispatchers.IO).launch {
            try {
                // 1. Send Telemetry
                NetworkClient.apiService.sendTelemetry(telemetryData)
                Log.d("MainActivity", "Telemetry data sent successfully")

                // 2. Request Task
                val task = NetworkClient.apiService.requestTask(TaskRequest(deviceId))
                Log.d("MainActivity", "Received task: $task")

                // 3. Execute Task
                val taskExecutor = TaskExecutor()
                val taskResult = taskExecutor.executeTask(task)
                Log.d("MainActivity", "Executed task: $taskResult")

                // 4. Generate Proof
                val proofGenerator = ProofGenerator(deviceId)
                val proof = proofGenerator.generateProof(taskResult)
                Log.d("MainActivity", "Generated proof: $proof")

                // 5. Submit Proof
                NetworkClient.apiService.submitProof(proof)
                Log.d("MainActivity", "Proof submitted successfully")

            } catch (e: Exception) {
                Log.e("MainActivity", "Error in task-proof loop", e)
            }
        }
    }
}
