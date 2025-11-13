# Energy Participation Score (EPS) Specification

## 1. Overview

The Energy Participation Score (EPS) is a numerical value calculated for each mobile device to determine its fitness for participating in the AEAMC network. It is a key component of the device selection process, ensuring that tasks are assigned to devices that are capable of completing them without significant energy drain or performance degradation.

## 2. EPS Formula

The EPS is calculated as a weighted sum of several normalized telemetry inputs. The formula is:

**EPS = w_b * f_b(battery%) + w_c * f_c(charger_state) + w_t * f_t(cpu_temp) + w_n * f_n(net_latency)**

Where:

- `w_*` are the weights for each component.
- `f_*` are bounded, monotonic transformation functions that normalize the raw telemetry data to a consistent scale (e.g., 0 to 1).

### 2.1. Components

- **`battery%`**: The current battery level of the device, as a percentage (0-100).
- **`charger_state`**: A boolean or enum indicating if the device is currently charging.
- **`cpu_temp`**: The estimated CPU temperature of the device.
- **`net_latency`**: The network latency of the device, measured in milliseconds.

### 2.2. Weights (`w_*`)

The weights are system-configurable parameters that allow the network to prioritize certain device characteristics. For example, a higher `w_b` would prioritize devices with more battery life. The sum of all weights should ideally be 1.

Example initial weights:

- `w_b` (battery): 0.4
- `w_c` (charger): 0.2
- `w_t` (temperature): 0.2
- `w_n` (network): 0.2

### 2.3. Transformation Functions (`f_*`)

The transformation functions normalize the raw telemetry data. These functions should be monotonic, meaning that they either consistently increase or decrease.

- **`f_b(battery%)`**: A simple linear function. `f_b(x) = x / 100`.
- **`f_c(charger_state)`**: A binary function. `f_c(x) = 1` if charging, `0` otherwise.
- **`f_t(cpu_temp)`**: An inverse function, as lower temperatures are better. For example, `f_t(x) = 1 - (x / max_temp)`.
- **`f_n(net_latency)`**: An inverse function, as lower latency is better. For example, `f_n(x) = 1 - (x / max_latency)`.

## 3. Example Calculation

Given a device with:

- `battery%` = 80
- `charger_state` = false (0)
- `cpu_temp` = 45°C (assuming `max_temp` = 80°C)
- `net_latency` = 50ms (assuming `max_latency` = 500ms)

And the example weights:

- `f_b(80)` = 0.8
- `f_c(0)` = 0
- `f_t(45)` = 1 - (45 / 80) = 0.4375
- `f_n(50)` = 1 - (50 / 500) = 0.9

The EPS would be:

`EPS = (0.4 * 0.8) + (0.2 * 0) + (0.2 * 0.4375) + (0.2 * 0.9)`
`EPS = 0.32 + 0 + 0.0875 + 0.18`
`EPS = 0.5875`
