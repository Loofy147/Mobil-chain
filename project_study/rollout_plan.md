# AEAMC Rollout Plan

This document provides a high-level plan for the rollout of the AEAMC network, aligning with the phases outlined in the feature roadmap.

## Rollout Milestones

| Milestone                                       | Owner                 | Dependencies                                                                              | Estimated Effort (Dev-Weeks) | Timeline  |
| :---------------------------------------------- | :-------------------- | :---------------------------------------------------------------------------------------- | :--------------------------- | :-------- |
| **Phase 1: MVP Launch**                         | Engineering           | - Finalized specifications for PoT, PoA, and EPS. <br>- Deployed Ethereum testnet.        | 34                           | Q1 2026   |
| **Phase 1: Onboard 50 Devices**                 | Product & Marketing   | - MVP Launch                                                                              | 2                            | Q1 2026   |
| **Phase 2: Decentralization and Security**      | Engineering           | - Research on decentralized consensus mechanisms.                                         | 24                           | Q2 2026   |
| **Phase 3: Monetization and Growth**            | Engineering & Product | - Legal review of tokenomics. <br>- Selection of a payment processor or L2 solution.       | 36                           | Q3 2026   |
| **Full Production Launch**                      | All Teams             | - All previous milestones completed.                                                      | -                            | Q1 2027   |

## Business Continuity and Rollback Plan

### Rollback Plan

-   **For the coordinator:** The system will use blue-green deployments. If a new version of the coordinator fails, traffic can be immediately routed back to the old version.
-   **For the mobile SDK:** The SDK will include a feature flag system to remotely disable any new features that cause issues.
-   **For the smart contract:** The smart contract will be designed to be pausable in case a critical vulnerability is discovered.

### Business Continuity Plan

-   **Coordinator Outage:** A hot standby of the coordinator will be maintained in a different geographical region.
-   **Blockchain Network Issues:** The system will be designed to be able to switch to a different Ethereum-compatible network if the primary one experiences a major outage.
-   **Data Loss:** The coordinator's database will be backed up daily.
