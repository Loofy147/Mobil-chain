package com.example.aeamc

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import java.io.File
import kotlin.system.measureTimeMillis

data class TelemetryData(
    val deviceId: String,
    val batteryPercentage: Float,
    val isCharging: Boolean,
    val cpuTemperature: Float,
    val networkLatency: Long
)

class TelemetryManager(private val context: Context) {

    suspend fun getTelemetryData(): TelemetryData {
        val deviceId = DeviceManager.getDeviceId(context)

        // Battery Info
        val batteryStatus: Intent? = IntentFilter(Intent.ACTION_BATTERY_CHANGED).let { ifilter ->
            context.registerReceiver(null, ifilter)
        }
        val level: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val batteryPct: Float = level / scale.toFloat() * 100
        val status: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging: Boolean = status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL

        // CPU Temperature
        val cpuTemp = getCpuTemperature()

        // Network Latency
        val latency = measureNetworkLatency()

        return TelemetryData(deviceId, batteryPct, isCharging, cpuTemp, latency)
    }

    private fun getCpuTemperature(): Float {
        // This is a common approach, but might not work on all devices.
        // It reads temperature from the thermal zones of the device.
        try {
            val tempFile = File("/sys/class/thermal/thermal_zone0/temp")
            val tempStr = tempFile.readText()
            return tempStr.trim().toFloat() / 1000.0f // Convert millidegrees to degrees Celsius
        } catch (e: Exception) {
            // Fallback if the file doesn't exist or can't be read
            return -1.0f
        }
    }

    private suspend fun measureNetworkLatency(): Long {
        return try {
            measureTimeMillis {
                NetworkClient.apiService.ping()
            }
        } catch (e: Exception) {
            -1L // Return -1 if the ping fails
        }
    }
}
