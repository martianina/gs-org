import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { logger, ProjectAgent, Character } from '@elizaos/core';
import communityManager from './communityManager';
import devRel from './devRel';
import liaison from './liaison';
import projectManager from './projectManager';
import socialMediaManager from './socialMediaManager';

/**
 * Checks if all required environment variables for an agent are available
 * @param agent The agent to check
 * @returns boolean indicating if all required environment variables are set
 */
function hasRequiredEnvVars(agent: ProjectAgent | { character: Partial<Character>; init: (runtime: any) => Promise<void> }): boolean {
  // Get which platform plugins the agent uses
  const usesDiscord = agent.character.plugins?.includes('@elizaos/plugin-discord');
  const usesTelegram = agent.character.plugins?.includes('@elizaos/plugin-telegram');

  // If no communication platforms are needed, we're good
  if (!usesDiscord && !usesTelegram) return true;

  // Check if at least one platform is properly configured
  let hasValidPlatform = false;

  if (usesDiscord) {
    // Get the actual values from agent settings
    const secrets = agent.character.settings?.secrets;
    const discordId = (typeof secrets === 'object' && secrets !== null) 
      ? secrets.DISCORD_APPLICATION_ID 
      : undefined;
    const discordToken = (typeof secrets === 'object' && secrets !== null)
      ? secrets.DISCORD_API_TOKEN
      : undefined;

    if (discordId && discordToken) {
      hasValidPlatform = true;
      logger.debug(`Agent "${agent.character.name || 'Unknown'}" has Discord configuration`);
    }
  }

  if (usesTelegram) {
    const secrets = agent.character.settings?.secrets;
    const telegramToken = (typeof secrets === 'object' && secrets !== null)
      ? secrets.TELEGRAM_BOT_TOKEN
      : undefined;

    if (telegramToken) {
      hasValidPlatform = true;
      logger.debug(`Agent "${agent.character.name || 'Unknown'}" has Telegram configuration`);
    }
  }

  if (!hasValidPlatform) {
    logger.warn(`Agent "${agent.character.name || 'Unknown'}" disabled - missing platform configuration`);
  }

  return hasValidPlatform;
}

// Define which agents you want to enable
const allAgents = [devRel, communityManager, liaison, projectManager, socialMediaManager];

// Get command line arguments
const rawArgs = process.argv.slice(2);

let enabledAgents = allAgents;
let potentialAgentFlags: string[] = [];

const doubleDashIndex = rawArgs.indexOf('--');

if (doubleDashIndex !== -1) {
  // If "--" is present, only consider arguments after it
  potentialAgentFlags = rawArgs.slice(doubleDashIndex + 1).filter((arg) => arg.startsWith('--'));
} else {
  // If "--" is not present (e.g. direct execution like `bun src/index.ts --devRel`)
  // Filter out known script runner commands or non-flag arguments
  potentialAgentFlags = rawArgs.filter((arg) => arg.startsWith('--') && arg !== '--');
}

if (potentialAgentFlags.length > 0) {
  const requestedAgentNames = potentialAgentFlags.map((arg) =>
    arg.replace(/^--/, '').toLowerCase()
  );
  
  const agentsMap = {
    devRel,
    communityManager,
    liaison,
    projectManager,
    socialMediaManager,
  };

  const matchedAgents = allAgents.filter((agent) => {
    // Find the key in agentsMap that corresponds to this agent
    const agentKey = Object.keys(agentsMap).find(
      (key) => agentsMap[key as keyof typeof agentsMap] === agent
    );
    
    // Check if the agent's key is in the requested names
    return agentKey ? requestedAgentNames.includes(agentKey.toLowerCase()) : false;
  });

  console.log('allAgents', allAgents);
  console.log('matchedAgents', matchedAgents);

  if (matchedAgents.length > 0) {
    enabledAgents = matchedAgents;
  } else {
    logger.warn(
      `No matching agents found for flags: ${potentialAgentFlags.join(', ')}. Available agent names (use --name):`
    );
    
    allAgents.forEach((agent) => {
      const objectKey = Object.keys(agentsMap).find(
        (key) => agentsMap[key as keyof typeof agentsMap] === agent
      );
      if (objectKey) {
        logger.warn(`  --${objectKey} (for ${agent.character.name || 'Unknown'})`);
      }
    });
    // If flags were passed but none matched, we should probably not run all agents.
    // Setting enabledAgents to empty will trigger the "NO AGENTS AVAILABLE" message later.
    enabledAgents = [];
  }
}
// If potentialAgentFlags is empty, enabledAgents remains allAgents (run all by default)

const availableAgents = enabledAgents.filter(hasRequiredEnvVars);

// Log the filtering results with accurate counts
if (allAgents.length === 0) {
  logger.warn('No agents are enabled in the configuration');
} else if (availableAgents.length === 0) {
  logger.error('NO AGENTS AVAILABLE - INITIALIZING DEFAULT ELIZA CHARACTER');
  logger.info('Configure the required platform integrations in your .env file');
} else if (availableAgents.length < enabledAgents.length) {
  logger.warn(
    `${enabledAgents.length - availableAgents.length} out of ${enabledAgents.length} enabled agents were filtered out due to missing platform requirements.`
  );
} else {
  logger.info(`${availableAgents.length} agents successfully initialized`);
}

export const project = {
  agents: availableAgents,
};

export default project;
