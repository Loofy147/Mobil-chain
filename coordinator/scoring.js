// scoring.js

// Based on the EPS Specification V1
const WEIGHTS = {
    battery: 0.4,
    charging: 0.2,
    temperature: 0.2,
    network: 0.2
};

// Max values for normalization (placeholders)
const MAX_TEMP = 80; // Celsius
const MAX_LATENCY = 500; // ms

function transformBattery(batteryPercentage) {
    return batteryPercentage / 100.0;
}

function transformCharging(isCharging) {
    return isCharging ? 1 : 0;
}

function transformTemperature(temp) {
    // Lower temp is better
    const normalizedTemp = Math.min(temp, MAX_TEMP) / MAX_TEMP;
    return 1 - normalizedTemp;
}

function transformNetwork(latency) {
    // Lower latency is better
    const normalizedLatency = Math.min(latency, MAX_LATENCY) / MAX_LATENCY;
    return 1 - normalizedLatency;
}

function calculateEPS(telemetry) {
    // For now, we only have battery data.
    // We will add the others as the client provides them.
    const batteryScore = WEIGHTS.battery * transformBattery(telemetry.batteryPercentage);
    const chargingScore = WEIGHTS.charging * transformCharging(telemetry.isCharging);

    // Placeholder scores for metrics not yet implemented client-side
    const temperatureScore = WEIGHTS.temperature * transformTemperature(40); // Assume 40C
    const networkScore = WEIGHTS.network * transformNetwork(100); // Assume 100ms

    const eps = batteryScore + chargingScore + temperatureScore + networkScore;

    return eps;
}

module.exports = { calculateEPS };
