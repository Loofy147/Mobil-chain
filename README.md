# AEAMC: Adaptive Energy-Aware Mobile Consensus

This repository contains the proof-of-concept implementation for the **Adaptive Energy-Aware Mobile Consensus (AEAMC)** project.

AEAMC is a mobile-first consensus and orchestration system designed for decentralized AI task scheduling and micro-transactions. It enables a network of mobile devices to securely and efficiently collaborate on tasks while minimizing energy consumption.

This project is based on the concepts outlined in the `mobil-minig-chain-patent.md` document.

## Current Status

The project is currently in **Phase 1: MVP Implementation**.

The core infrastructure is in place, including:
- A functional Android SDK that can collect telemetry and execute a full task-proof loop.
- A Node.js coordinator that can receive telemetry, assign tasks based on a device's Energy Participation Score (EPS), and receive proofs of task completion.

For a detailed breakdown of all tasks and their current status, please see `PROJECT_PLAN.md`.

## Project Structure

The repository is organized into the following key directories:

- `/specifications`: Contains the detailed technical specifications for the core components of the AEAMC system (EPS, PoT, PoA, Microblocks).
- `/sdk/android`: The source code for the Android SDK, which acts as the mobile client in the network.
- `/coordinator`: The source code for the Node.js-based microblock coordinator, which manages the network and orchestrates tasks.
- `PROJECT_PLAN.md`: A detailed project plan outlining the tasks for the MVP.
- `mobil-minig-chain-patent.md`: The original patent draft and conceptual overview of the AEAMC project.

## Getting Started

To run the full end-to-end system, you will need to start both the coordinator and the Android SDK.

### 1. Run the Coordinator

The coordinator is a Node.js server.

```bash
# Navigate to the coordinator directory
cd coordinator

# Install dependencies
npm install

# Start the server
npm start
```

The server will start and listen on `http://localhost:3000`. You will see log output in the console as it receives requests from the mobile client.

### 2. Run the Android SDK

The Android SDK is a standard Android application.

1.  Open the `sdk/android` directory in Android Studio.
2.  Let Gradle sync the project.
3.  Run the application on an Android emulator or a physical device.

The app will automatically start, collect telemetry, and begin the task-proof loop. You can view the detailed log output in the **Logcat** window in Android Studio (filter by the tag "MainActivity").
