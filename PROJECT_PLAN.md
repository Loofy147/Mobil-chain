# AEAMC Project Plan (MVP)

This document outlines the detailed tasks for the proof-of-concept implementation of the Adaptive Energy-Aware Mobile Consensus (AEAMC) project, based on the MVP plan in the patent draft.

---

## Phase 0: Specification & Simulation

**Goal:** Define the core algorithms and simulate their performance and energy consumption before implementation.

- [ ] **Task 0.1: Define Core Specifications**
  - [ ] Define the precise mathematical formula for the Energy Participation Score (EPS).
  - [ ] Specify the exact data structure for the Proof-of-Task (PoT), including the cryptographic binding mechanism.
  - [ ] Specify the data structure for the Proof-of-Availability (PoA) heartbeat.
  - [ ] Define the binary format for microblocks, including headers and payload.

- [ ] **Task 0.2: Develop Simulation Environment**
  - [ ] Choose a simulation framework (e.g., Python with SimPy).
  - [ ] Create models for mobile device properties (battery, CPU, network).
  - [ ] Create a model for the network topology and message passing.

- [ ] **Task 0.3: Implement and Run Simulations**
  - [ ] Implement the device selection function based on the EPS formula.
  - [ ] Simulate the process of task assignment, PoT/PoA generation, and microblock formation.
  - [ ] Design and run simulations for various workloads (e.g., high/low task frequency, varying number of devices).
  - [ ] Collect data on simulated energy consumption, task throughput, and network latency.

- [ ] **Task 0.4: Analyze and Refine**
  - [ ] Analyze simulation results to identify bottlenecks or inefficiencies.
  - [ ] Refine the specifications from Task 0.1 based on the findings.

---

## Phase 1: Mobile SDK + Coordinator

**Goal:** Build the core components for the mobile client and the backend coordinator.

- [ ] **Task 1.1: Mobile SDK (Android - Kotlin)**
  - [ ] Set up the base Android project structure.
  - [ ] Implement a **Telemetry Module** to collect and sign device data (battery, CPU, network).
  - [ ] Implement a **Task Execution Module** to handle placeholder AI tasks.
  - [ ] Implement a **Proof Generation Module** to create PoT receipts and PoA heartbeats.
  - [ ] Implement a **Network Client** (gRPC or REST) to communicate with the coordinator.

- [ ] **Task 1.2: Microblock Coordinator (Node.js or Go)**
  - [ ] Set up the base backend project structure.
  - [ ] Implement API endpoints to receive telemetry and proofs from the mobile SDK.
  - [ ] Implement the **Device Selection Engine** based on the EPS specification.
  - [ ] Implement the **Task Assignment Logic** to distribute tasks to selected devices.
  - [ ] Implement the **Microblock Formation Service** to collect verified receipts and create microblocks.

---

## Phase 2: Verification & Anchoring

**Goal:** Implement the mechanism to verify tasks and ensure long-term immutability.

- [ ] **Task 2.1: Implement Spot-Check Service**
  - [ ] Design and build a service that can receive a PoT and perform a randomized spot-check verification.
  - [ ] Integrate this service into the coordinator's workflow before including receipts in a microblock.

- [ ] **Task 2.2: Implement Anchoring Adapter**
  - [ ] Set up a connection to an Ethereum testnet (e.g., Sepolia).
  - [ ] Create a smart contract to store and verify microblock digests.
  - [ ] Implement an **Anchoring Service** in the coordinator that periodically sends microblock digests to the smart contract.

---

## Phase 3: Payments & Channels

**Goal:** Integrate a micropayment system for fair compensation.

- [ ] **Task 3.1: Research and Integration**
  - [ ] Research and select a suitable Layer-2 or state channel solution for micropayments.
  - [ ] Integrate the selected payment solution's SDK into the mobile client and coordinator.

- [ ] **Task 3.2: Implement Payment Logic**
  - [ ] Implement logic in the coordinator to batch and settle payments based on verified receipts in microblocks.
  - [ ] Implement a dispute resolution mechanism for payment challenges.

---

## Phase 4: Field Beta & Metrics

**Goal:** Deploy the system to a small group of users and gather real-world performance data.

- [ ] **Task 4.1: Prepare for Deployment**
  - [ ] Build instrumentation into the mobile SDK to log battery drain, latency, and throughput.
  - [ ] Create a simple dashboard to visualize key network metrics.
  - [ ] Prepare deployment packages for the Android app and the coordinator.

- [ ] **Task 4.2: Recruit and Deploy**
  - [ ] Recruit a small group of volunteers for the beta test.
  - [ ] Deploy the coordinator to a cloud service.
  - [ ] Distribute the Android app to the volunteers.

- [ ] **Task 4.3: Collect and Analyze**
  - [ ] Monitor the network and collect performance data over a set period.
  - [ ] Analyze the real-world metrics to validate the energy-saving and performance claims.
  - [ ] Gather feedback from beta testers.
