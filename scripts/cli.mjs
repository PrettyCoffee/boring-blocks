#! /usr/bin/env node

import { spawnSync } from "node:child_process"
import { parseArgs } from "node:util"

const commands = {
  build: {
    description: "Transpile the library to usable code",
    script: "./build.mjs",
  },
}

const flags = {
  help: {
    type: "boolean",
    short: "h",
    description: "Display the help page",
  },
  verbose: {
    type: "boolean",
    short: "v",
    description: "Print more information in the terminal",
  },
}

const parseArgv = () => {
  const name = process.argv[2]
  const script = commands[name]?.script
  if (!name || !script) return { help: true }

  const { values: args } = parseArgs({
    args: process.argv.slice(3),
    allowPositionals: false,
    options: flags,
  })

  return { name, script, ...args }
}

const command = parseArgv()

if (!command.name || command.help) {
  console.info("Usage: boring-blocks <command>")
  console.info("\nAvailable commands:")
  Object.entries(commands).forEach(([name, { description }]) => {
    console.info(`  ${name}: ${description}`)
  })
  console.info("\nAvailable flags:")
  Object.entries(flags).forEach(([name, { short, description }]) => {
    console.info(`  --${name}, -${short}: ${description}`)
  })
  process.exit(1)
}

console.info(`ℹ️ Running boring-blocks ${command.name}...`)

spawnSync(`node ${command.script}`, {
  cwd: import.meta.dirname,
  stdio: command.verbose ? "inherit" : "pipe",
  shell: true,
})
