# AEAMC Feature Roadmap

This document outlines the phased development of the AEAMC network, from an initial Minimum Viable Product (MVP) to a feature-complete, production-grade system.

## Phase 1: MVP (Target: Q1 2026)

### Objective: Prove the core functionality and viability of the AEAMC network.

| Feature                                | Rationale                                                                                                   | Key Performance Indicators (KPIs)                                                                       | Estimated Effort (Dev-Weeks) |
| :------------------------------------- | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ | :--------------------------- |
| **Centralized Coordinator**            | A centralized coordinator is the simplest way to launch the network and test the core logic.                  | - Coordinator can handle at least 100 concurrent devices. <br>- 99.9% uptime for the coordinator service. | 8                            |
| **Android SDK with Basic Telemetry**   | An Android SDK is necessary to onboard mobile devices. Basic telemetry is sufficient for the MVP.             | - At least 50 devices onboarded. <br>- Successful collection of battery and charging state telemetry.     | 12                           |
| **PoT and PoA Generation**             | The core consensus mechanisms must be in place to ensure the integrity of the network.                       | - 100% of tasks have a corresponding PoT. <br>- PoA heartbeats are received every 5 minutes.             | 6                            |
| **Microblock Formation and Anchoring** | The anchoring of microblocks to a public blockchain is a key security feature.                               | - Microblocks are successfully anchored to the Ethereum testnet every hour. <br>- No invalid microblocks. | 4                            |
| **Basic Investor Dashboard**           | A dashboard is needed to visualize network activity and demonstrate progress to stakeholders.                  | - Real-time display of the number of active devices and completed tasks.                                | 4                            |

## Phase 2: Decentralization and Security (Target: Q2 2026)

### Objective: Enhance the decentralization and security of the network.

| Feature                           | Rationale                                                                                             | Key Performance Indicators (KPIs)                                                                                             | Estimated Effort (Dev-Weeks) |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| **Decentralized Coordinator**     | A decentralized coordinator removes the single point of failure and increases the network's resilience. | - A new coordinator is elected every 24 hours. <br>- The network remains operational during coordinator elections.          | 16                           |
| **Third-Party Smart Contract Audit** | An audit is essential to identify and mitigate any vulnerabilities in the smart contract.               | - A clean audit report from a reputable security firm. <br>- All identified issues are addressed.                               | 2                            |
| **Enhanced Telemetry Collection** | More detailed telemetry will allow for more sophisticated device selection.                             | - Collection of CPU temperature and network latency data. <br>- 10% improvement in task success rate due to better selection. | 4                            |
| **Bug Bounty Program**            | A bug bounty program will incentivize security researchers to find and report vulnerabilities.         | - At least 10 security researchers participating. <br>- All critical vulnerabilities are patched within 48 hours.         | 2                            |

## Phase 3: Monetization and Growth (Target: Q3 2026)

### Objective: Introduce monetization and scale the network.

| Feature                             | Rationale                                                                                           | Key Performance Indicators (KPIs)                                                                                              | Estimated Effort (Dev-Weeks) |
| :---------------------------------- | :-------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| **Micropayment System**             | A micropayment system is needed to reward participants and create a sustainable economic model.       | - Successful processing of micropayments for at least 99.9% of completed tasks. <br>- A clear and transparent fee structure. | 12                           |
| **iOS SDK**                         | An iOS SDK will significantly expand the potential user base of the network.                          | - At least 50 iOS devices onboarded. <br>- Feature parity with the Android SDK.                                                | 12                           |
| **Developer API and SDK**           | A developer API will allow third-party developers to build applications on top of the AEAMC network. | - At least 5 third-party applications in development. <br>- A comprehensive set of documentation for the API.                   | 8                            |
| **Marketing and Community Building**| A strong marketing push is needed to attract users and developers to the network.                      | - 1000 active devices on the network. <br>- A thriving online community on platforms like Discord and Twitter.               | 4                            |
