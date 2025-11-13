package com.example.aeamc

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import kotlinx.coroutines.delay

data class BatteryMetrics(
    val startLevel: Float,
    val endLevel: Float,
    val drainPercent: Float,
    val durationMs: Long,
    val avgCurrentMa: Float,
    val energyMwh: Float
)

data class ComparisonResult(
    val taskName: String,
    val aeamcMetrics: BatteryMetrics,
    val baselineMetrics: BatteryMetrics,
    val energyImprovement: Double
)

class BatteryMonitor(private val context: Context) {

    private val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager

    /**
     * Get current battery level (0-100)
     */
    fun getCurrentLevel(): Float {
        val level = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
        return level.toFloat()
    }

    /**
     * Get current draw in microamps
     */
    fun getCurrentDraw(): Float {
        // Returns negative value (discharge) or positive (charge)
        return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CURRENT_NOW).toFloat()
    }

    /**
     * Measure battery consumption during a task
     */
    suspend fun measureTask(taskName: String, task: suspend () -> Unit): BatteryMetrics {
        val startLevel = getCurrentLevel()
        val startTime = System.currentTimeMillis()

        // Sample current draw during execution
        val currentSamples = mutableListOf<Float>()

        val samplingJob = kotlinx.coroutines.GlobalScope.launch {
            while (true) {
                currentSamples.add(getCurrentDraw())
                delay(100) // Sample every 100ms
            }
        }

        // Execute task
        task()

        samplingJob.cancel()

        val endLevel = getCurrentLevel()
        val endTime = System.currentTimeMillis()
        val duration = endTime - startTime

        val avgCurrent = currentSamples.average().toFloat() / 1000 // Convert μA to mA
        val drainPercent = startLevel - endLevel

        // Energy = Power × Time
        // Power (W) = Voltage (V) × Current (A)
        // Assume 3.7V battery (typical for phones)
        val voltage = 3.7f
        val energyMwh = (voltage * Math.abs(avgCurrent) * (duration / 3600000f)) // mWh

        return BatteryMetrics(
            startLevel = startLevel,
            endLevel = endLevel,
            drainPercent = drainPercent,
            durationMs = duration,
            avgCurrentMa = Math.abs(avgCurrent),
            energyMwh = energyMwh
        )
    }

    /**
     * Compare AEAMC approach vs baseline
     */
    suspend fun runComparison(
        taskName: String,
        aeamcTask: suspend () -> Unit,
        baselineTask: suspend () -> Unit
    ): ComparisonResult {

        android.util.Log.d("BatteryMonitor", "Running comparison for: $taskName")

        // Wait for battery to stabilize
        delay(5000)

        // Run AEAMC version
        android.util.Log.d("BatteryMonitor", "Running AEAMC version...")
        val aeamcMetrics = measureTask("${taskName}_AEAMC", aeamcTask)

        // Cool down
        delay(10000)

        // Run baseline version
        android.util.Log.d("BatteryMonitor", "Running baseline version...")
        val baselineMetrics = measureTask("${taskName}_Baseline", baselineTask)

        val improvement = ((baselineMetrics.energyMwh - aeamcMetrics.energyMwh) / baselineMetrics.energyMwh) * 100

        android.util.Log.d("BatteryMonitor", """
            Comparison complete:
            AEAMC: ${aeamcMetrics.energyMwh}mWh
            Baseline: ${baselineMetrics.energyMwh}mWh
            Improvement: ${improvement.toInt()}%
        """.trimIndent())

        return ComparisonResult(
            taskName = taskName,
            aeamcMetrics = aeamcMetrics,
            baselineMetrics = baselineMetrics,
            energyImprovement = improvement
        )
    }

    // Measurement tracking
    private val measurements = mutableMapOf<String, MutableList<Float>>()

    fun startMeasurement(taskId: String) {
        measurements[taskId] = mutableListOf(getCurrentLevel())
    }

    fun stopMeasurement(taskId: String): BatteryMetrics {
        val samples = measurements[taskId] ?: return BatteryMetrics(0f, 0f, 0f, 0, 0f, 0f)
        samples.add(getCurrentLevel())

        return BatteryMetrics(
            startLevel = samples.first(),
            endLevel = samples.last(),
            drainPercent = samples.first() - samples.last(),
            durationMs = 0,
            avgCurrentMa = 0f,
            energyMwh = 0f
        )
    }
}