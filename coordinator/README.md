# AEAMC Microblock Coordinator

This directory contains the microblock coordinator for the Adaptive Energy-Aware Mobile Consensus (AEAMC) project.

## Purpose

The purpose of this coordinator is to:
- Receive telemetry and proofs from mobile devices.
- Select devices for task assignment based on their Energy Participation Score (EPS).
- Assign tasks to selected devices.
- Form microblocks from verified task receipts.
- Anchor microblock digests to a higher-tier ledger.

## Structure

- `index.js`: The main entry point for the application.
- `package.json`: Project metadata and dependencies.
- `README.md`: This file.

## Getting Started

To run the coordinator, navigate to this directory and run:

```bash
npm install
npm start
```
