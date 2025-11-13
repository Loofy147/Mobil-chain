# Microblock Format Specification

## 1. Overview

Microblocks are the core data structures used in the AEAMC network to batch together task receipts and payment intents. They are designed to be compact and efficient for transmission in a mobile environment. This document specifies the binary format of the microblocks.

## 2. Microblock Structure

A microblock consists of two main parts: a header and a payload.

```
+-------------------+
|  Microblock Header|
+-------------------+
| Microblock Payload|
+-------------------+
```

### 2.1. Microblock Header

The header contains metadata about the microblock.

| Field              | Type      | Size (bytes) | Description                                     |
| ------------------ | --------- | ------------ | ----------------------------------------------- |
| `magic_number`     | `uint32`  | 4            | A constant value to identify the start of a block |
| `version`          | `uint8`   | 1            | The version of the microblock format            |
| `cluster_id`       | `uint32`  | 4            | The ID of the cluster that generated the block    |
| `timestamp`        | `uint64`  | 8            | Unix timestamp (in milliseconds) of block creation |
| `payload_hash`     | `bytes32` | 32           | The SHA-256 hash of the microblock payload      |
| `previous_hash`    | `bytes32` | 32           | The hash of the previous microblock in the chain |
| `receipt_count`    | `uint16`  | 2            | The number of receipts in the payload           |

**Total Header Size:** 83 bytes

### 2.2. Microblock Payload

The payload contains a list of PoT receipts.

| Field     | Type                | Size (bytes) | Description                          |
| --------- | ------------------- | ------------ | ------------------------------------ |
| `receipts`| `array[PoTReceipt]` | variable     | A list of PoT receipts               |

Each `PoTReceipt` in the array has the following structure:

| Field         | Type      | Size (bytes) | Description                               |
| ------------- | --------- | ------------ | ----------------------------------------- |
| `task_id_len` | `uint8`   | 1            | The length of the `task_id` string        |
| `task_id`     | `string`  | variable     | The unique identifier for the task        |
| `device_id_len`| `uint8`  | 1            | The length of the `device_id` string      |
| `device_id`   | `string`  | variable     | The ID of the device that executed the task |
| `signature`   | `bytes64` | 64           | The signature of the PoT                  |

## 3. Serialization

The microblock is serialized into a byte array for transmission over the network. The fields are written in the order they appear in the tables above, using little-endian byte order for multi-byte integers.
