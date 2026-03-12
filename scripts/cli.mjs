#! /usr/bin/env node

import { spawnSync } from "node:child_process"

const commands = {
  build: {
    description: "Transpile the library to usable code",
    script: "./build.mjs",
  },
}

const args = process.argv.slice(2)
const command = commands[args[0] ?? ""]

if (!command) {
  console.info("Usage: boring-blocks <command>")
  console.info("\nAvailable commands:")
  Object.entries(commands).forEach(([cmd, { description }]) => {
    console.info(`  ${cmd}: ${description}`)
  })
  process.exit(1)
}

spawnSync(`node ${command.script}`, {
  cwd: import.meta.dirname,
  stdio: "inherit",
  shell: true,
})
