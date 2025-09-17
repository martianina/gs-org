# The Org - Multi-Agent System

[![ElizaOS](https://img.shields.io/badge/Powered%20by-ElizaOS-blueviolet)](https://elizaos.com) [![Bun](https://img.shields.io/badge/Runtime-Bun-yellowgreen)](https://bun.sh/) [![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](https://www.typescriptlang.org/)

The Org is a sophisticated multi-agent system built using the ElizaOS framework. It features a collection of specialized AI agents designed to handle various organizational functions, including community management, developer relations, project coordination, social media management, and inter-organizational liaison.

## Features

*   **Modular Agent-Based Architecture**: Easily extendable with new agents and capabilities.
*   **Specialized AI Agents**:
    *   **Eli5 (Community Manager)**: Welcomes users, moderates discussions, and manages community health.
    *   **Eddy (Developer Relations)**: Provides documentation support, code examples, and technical assistance.
    *   **Ruby (Community Liaison)**: Facilitates cross-community knowledge sharing and identifies synergies.
    *   **Jimmy (Project Manager)**: Coordinates projects, tracks progress, and manages team check-ins.
    *   **Laura (Social Media Manager)**: Crafts and publishes content across social media platforms.
*   **Multi-Platform Integration**: Seamlessly interacts with Discord, Telegram, and Twitter.
*   **Persistent Memory & State**: Utilizes SQL (via `@elizaos/plugin-sql`) for robust data storage.
*   **Advanced LLM Integration**: Supports models from OpenAI, Anthropic, and local AI setups.
*   **Dynamic Onboarding & Configuration**: Flexible system for setting up and customizing agents.
*   **Comprehensive Load Testing Suite**: Tools to evaluate and ensure agent scalability.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (Latest LTS version recommended)
*   [Bun](https://bun.sh/) (v1.0 or higher)
*   Access to a [PostgreSQL](https://www.postgresql.org/) database (recommended for full functionality with `@elizaos/plugin-sql`).

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd the-org
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project (`/Users/shawwalters/the-org/.env`). See the [Configuration (.env file)](#configuration-env-file) section below for details on the required variables.

4.  **Run the application:**
    ```bash
    bun src/index.ts
    ```
    This will start all agents for which the necessary environment variables are configured. To run specific agents, see [Running Specific Agents](#running-specific-agents).

## Configuration (`.env` file)

The Org uses a `.env` file located at the root of the project to manage environment-specific configurations, such as API keys and service credentials.

Create a `.env` file by copying the example below and filling in your actual values:

```env
# General Configuration
POSTGRES_URL=postgresql://user:password@host:port/database # For @elizaos/plugin-sql
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# --- Agent Specific Configurations ---

# Community Manager (Eli5)
COMMUNITY_MANAGER_DISCORD_APPLICATION_ID=your_discord_app_id
COMMUNITY_MANAGER_DISCORD_API_TOKEN=your_discord_bot_token

# Developer Relations (Eddy)
DEV_REL_DISCORD_APPLICATION_ID=your_discord_app_id
DEV_REL_DISCORD_API_TOKEN=your_discord_bot_token
DEVREL_IMPORT_KNOWLEDGE=true # Set to false to disable knowledge base loading on startup

# Liaison (Ruby)
LIAISON_DISCORD_APPLICATION_ID=your_discord_app_id
LIAISON_DISCORD_API_TOKEN=your_discord_bot_token

# Project Manager (Jimmy)
PROJECT_MANAGER_DISCORD_APPLICATION_ID=your_discord_app_id
PROJECT_MANAGER_DISCORD_API_TOKEN=your_discord_bot_token
PROJECT_MANAGER_TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Social Media Manager (Laura)
SOCIAL_MEDIA_MANAGER_DISCORD_APPLICATION_ID=your_discord_app_id
SOCIAL_MEDIA_MANAGER_DISCORD_API_TOKEN=your_discord_bot_token
# Twitter credentials for Laura (Social Media Manager)
TWITTER_USERNAME=your_twitter_username
TWITTER_EMAIL=your_twitter_email
TWITTER_PASSWORD=your_twitter_password
TWITTER_2FA_SECRET=your_twitter_2fa_secret # Optional, if 2FA is enabled

# Note: If an agent uses a platform (e.g., Telegram) but its specific token is not provided,
# that agent might not be able to use that platform's features or might be disabled if
# the platform is critical for its core function and no alternatives are configured.
```

**Important:**
*   Ensure that at least one communication platform (Discord or Telegram) is correctly configured with its respective API tokens for each agent you intend to run. If an agent is configured to use a platform but lacks the necessary tokens, it may be disabled or have limited functionality.
*   The `src/index.ts` file filters agents based on the availability of required environment variables for their configured communication plugins.

## Running the Project

### Running All Available Agents

To run all agents that have their required environment variables configured:

```bash
bun src/index.ts
```

The application will automatically detect and initialize agents for which the necessary API keys and tokens are provided in the `.env` file.

### Running Specific Agents

You can run a subset of agents by providing their names as command-line flags. The agent names for flags correspond to the keys used when defining them in `src/index.ts`.

Available agent flags:
*   `--communityManager`
*   `--devRel`
*   `--liaison`
*   `--projectManager`
*   `--socialMediaManager`

Example: To run only the Developer Relations (Eddy) and Project Manager (Jimmy) agents:

```bash
bun src/index.ts --devRel --projectManager
```

If you provide flags for agents whose environment variables are not correctly set up, those agents will not start.

## Project Structure

The project is organized as follows:

```
the-org/
├── src/
│   ├── assets/                  # Shared assets for all agents
│   ├── communityManager/        # Eli5 - Community Manager Agent
│   │   ├── actions/             # Custom actions for Eli5
│   │   ├── assets/              # Assets specific to Eli5 (e.g., portrait.jpg)
│   │   ├── plugins/             # Core plugins for Eli5
│   │   │   └── communityManager/
│   │   │       ├── actions/     # Plugin-specific actions (e.g., timeout.ts)
│   │   │       ├── providers/   # Data providers (e.g., timeoutUserProvider.ts)
│   │   │       ├── communityService.ts # Core service logic for the plugin
│   │   │       ├── types.ts
│   │   │       └── index.ts     # Plugin definition
│   │   ├── index.ts             # Eli5 agent definition & character
│   │   └── spec.md              # (If exists) Agent specification
│   ├── devRel/                  # Eddy - Developer Relations Agent
│   │   ├── assets/
│   │   ├── index.ts
│   │   └── spec.md
│   ├── liaison/                 # Ruby - Community Liaison Agent
│   │   ├── assets/
│   │   ├── index.ts
│   │   └── spec.md
│   ├── loadTest/                # Agent Load Testing Suite
│   │   ├── __tests__/
│   │   ├── logs/                # Output logs from load tests
│   │   ├── index.ts
│   │   ├── service.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── test-runner.js       # Script to execute load tests
│   ├── projectManager/          # Jimmy - Project Manager Agent
│   │   ├── assets/
│   │   ├── plugins/
│   │   │   └── team-coordinator/# Plugin for team coordination
│   │   │       ├── actions/     # Team management actions
│   │   │       ├── forms/       # Discord form definitions
│   │   │       ├── services/    # Services (CheckInService, TeamUpdateTrackerService)
│   │   │       ├── tasks.ts     # Background task definitions
│   │   │       └── index.ts
│   │   │   └── index.ts         # Aggregates team-coordinator plugins
│   │   ├── types/               # TypeScript type definitions for Project Manager
│   │   ├── utils/               # Utility functions (e.g., dateTime.ts)
│   │   ├── index.ts
│   │   └── spec.md
│   ├── socialMediaManager/      # Laura - Social Media Manager Agent
│   │   ├── actions/
│   │   ├── assets/
│   │   ├── index.ts
│   │   └── spec.md
│   ├── init.ts                  # Common character initialization logic for agents
│   ├── index.ts                 # Main entry point, aggregates and exports all agents
│   └── plugins.test.ts          # Vitest tests for ElizaOS plugins
├── .env                         # Environment variables (create this file)
├── bun.lockb                    # Bun lockfile
├── package.json                 # Project dependencies and scripts
└── README.md                    # This file
```

## Available Agents

*   **Eli5 (Community Manager)**:
    *   Manages community interactions, welcomes new users, and handles moderation tasks such as user timeouts based on community guidelines.
    *   Configured in `src/communityManager/`.

*   **Eddy (Developer Relations)**:
    *   Assists developers by providing documentation-based support, generating code examples, and maintaining a knowledge base from project documentation and past interactions.
    *   Configured in `src/devRel/`.

*   **Ruby (Community Liaison)**:
    *   Monitors discussions across multiple community platforms (Discord, Telegram, Slack), identifies parallel conversations and shared interests, and generates topic-based reports to facilitate cross-community knowledge sharing.
    *   Configured in `src/liaison/`.

*   **Jimmy (Project Manager)**:
    *   Manages projects, tracks progress through daily updates, coordinates team members (availability, check-ins), identifies blockers, and generates reports. Features a `team-coordinator` plugin for detailed team management.
    *   Configured in `src/projectManager/`.

*   **Laura (Social Media Manager)**:
    *   Handles social media communications across Discord and Twitter. Crafts and posts approved content, manages media assets, and ensures brand consistency.
    *   Configured in `src/socialMediaManager/`.

## Testing

The project uses [Vitest](https://vitest.dev/) for unit and integration testing.

*   **Run all tests:**
    ```bash
    bun test
    ```

*   **Run tests for a specific file:**
    ```bash
    bun test src/plugins.test.ts
    ```
    (Replace with the path to the test file you want to run).

*   **Plugin Tests**: `src/plugins.test.ts` contains tests specifically for the ElizaOS plugins used within the project.

### Load Testing

The `src/loadTest/` directory contains a suite for testing agent scalability.
*   **To run the load tests:** Execute the `test-runner.js` script. This script orchestrates the execution of `scale.test.ts`.
    ```bash
    bun src/loadTest/test-runner.js
    ```
*   **Logs**: Detailed logs and summaries for each test configuration will be generated in the `src/loadTest/logs/` directory. These logs help identify breaking points and optimal configurations for agent scaling.

## Key Technologies

*   [ElizaOS](https://elizaos.com): The core framework for building multi-agent systems.
*   [Bun](https://bun.sh/): Fast JavaScript runtime, bundler, and package manager.
*   [TypeScript](https://www.typescriptlang.org/): Superset of JavaScript adding static types.
*   [Discord.js](https://discord.js.org/): Library for interacting with the Discord API.
*   Various ElizaOS plugins for SQL, LLMs (OpenAI, Anthropic), platform integrations (Discord, Twitter, Telegram), and utility functions.

## Contributing

Contributions are welcome! Please feel free to open an issue to discuss a new feature or bug, or submit a pull request with your changes.

## License

(Consider adding a license, e.g., MIT, Apache 2.0. If not specified, you can state "All rights reserved" or leave this section out.)
This project is currently unlicensed.
