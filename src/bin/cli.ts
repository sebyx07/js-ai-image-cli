#!/usr/bin/env node

import { Command } from "commander";
import { registerBalanceCommand } from "../commands/balance";
import { registerGenerateCommand } from "../commands/generate";
import { registerLoginCommand } from "../commands/login";
import { registerModelsCommand } from "../commands/models";
import { registerStatusCommand } from "../commands/status";

const program = new Command();

program
  .name("ai-image")
  .description("Generate AI images, videos, music & speech from your terminal — powered by Kubeez (https://kubeez.com)")
  .version("0.1.0");

registerLoginCommand(program);
registerModelsCommand(program);
registerGenerateCommand(program);
registerStatusCommand(program);
registerBalanceCommand(program);

program.parse();
