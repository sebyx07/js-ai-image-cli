#!/usr/bin/env node

import { Command } from "commander";
import { registerAdCopyCommand } from "../commands/adcopy";
import { registerBalanceCommand } from "../commands/balance";
import { registerDialogueCommand } from "../commands/dialogue";
import { registerGenerateCommand } from "../commands/generate";
import { registerGenerationsCommand } from "../commands/generations";
import { registerLoginCommand } from "../commands/login";
import { registerModelsCommand } from "../commands/models";
import { registerMusicCommand } from "../commands/music";
import { registerStatusCommand } from "../commands/status";
import { registerUploadCommand } from "../commands/upload";

const program = new Command();

program
  .name("ai-image")
  .description("Generate AI images, videos, music & speech from your terminal — powered by Kubeez (https://kubeez.com)")
  .version("2.0.0");

registerLoginCommand(program);
registerModelsCommand(program);
registerGenerateCommand(program);
registerMusicCommand(program);
registerDialogueCommand(program);
registerAdCopyCommand(program);
registerUploadCommand(program);
registerStatusCommand(program);
registerBalanceCommand(program);
registerGenerationsCommand(program);

program.parse();
