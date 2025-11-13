package com.example.aeamc

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager

data class TelemetryData(
    val batteryPercentage: Float,
    val isCharging: Boolean
)

class TelemetryManager(private val context: Context) {

    fun getTelemetryData(): TelemetryData {
        val batteryStatus: Intent? = IntentFilter(Intent.ACTION_BATTERY_CHANGED).let { ifilter ->
            context.registerReceiver(null, ifilter)
        }

        val level: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val batteryPct: Float = level / scale.toFloat() * 100

        val status: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging: Boolean = status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL

        return TelemetryData(batteryPct, isCharging)
    }
}
