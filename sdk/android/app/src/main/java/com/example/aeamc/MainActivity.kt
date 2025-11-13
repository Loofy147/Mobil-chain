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

        Log.d("MainActivity", "Telemetry Data: $telemetryData")

        CoroutineScope(Dispatchers.IO).launch {
            try {
                NetworkClient.telemetryService.sendTelemetry(telemetryData)
                Log.d("MainActivity", "Telemetry data sent successfully")
            } catch (e: Exception) {
                Log.e("MainActivity", "Error sending telemetry data", e)
            }
        }
    }
}
