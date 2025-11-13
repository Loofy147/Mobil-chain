# Proof-of-Availability (PoA) Specification

## 1. Overview

The Proof-of-Availability (PoA) is a lightweight, signed heartbeat message that a mobile device periodically sends to the network to prove its liveness and availability. It is a crucial component for the microblock coordinator to ensure that it only assigns tasks to devices that are currently online and responsive.

## 2. Data Structure

The PoA is a simple data structure with the following fields:

```
{
  "device_id": "string",
  "timestamp": "int64",
  "signature": "string"
}
```

### 2.1. Fields

- **`device_id`**: The unique identifier of the device sending the heartbeat.
- **`timestamp`**: The Unix timestamp (in milliseconds) when the PoA was generated. This is used to ensure the freshness of the heartbeat and prevent replay attacks.
- **`signature`**: A digital signature of the `device_id` and `timestamp`, created using the device's private key. This ensures the authenticity of the PoA.

## 3. Generation and Verification

- **Generation**: The mobile device generates a PoA by creating a message containing its `device_id` and the current `timestamp`, and then signing this message with its private key.
- **Verification**: The microblock coordinator verifies a PoA by:
    1. Checking the signature using the device's public key.
    2. Ensuring the timestamp is recent and within an acceptable time window.

## 4. Usage

The coordinator requires a certain number of valid PoAs from a device within a specific time window before it will consider that device eligible for task assignment in the current microblock. This mechanism prevents tasks from being assigned to devices that have gone offline.
