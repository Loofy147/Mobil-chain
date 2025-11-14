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
    const batteryScore = WEIGHTS.battery * transformBattery(telemetry.batteryPercentage);
    const chargingScore = WEIGHTS.charging * transformCharging(telemetry.isCharging);
    const temperatureScore = WEIGHTS.temperature * transformTemperature(telemetry.cpuTemperature);
    const networkScore = WEIGHTS.network * transformNetwork(telemetry.networkLatency);

    const eps = batteryScore + chargingScore + temperatureScore + networkScore;

    return eps;
}

module.exports = { calculateEPS };
