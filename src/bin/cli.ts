#!/usr/bin/env node

import { Command } from "commander";
import { registerLoginCommand } from "../commands/login";

const program = new Command();

program
  .name("ai-image")
  .description("Generate AI images, videos, music & speech from your terminal — powered by Kubeez (https://kubeez.com)")
  .version("0.1.0");

registerLoginCommand(program);

program.parse();
