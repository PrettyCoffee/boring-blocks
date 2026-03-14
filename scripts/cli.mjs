#! /usr/bin/env node

import { spawnSync } from "node:child_process"

const commands = [
  {
    name: "build",
    description: "Transpile the library to usable code",
    script: "./build.mjs",
  },
]

const flags = [
  { name: "help", description: "Display the help page" },
  { name: "verbose", description: "Print more information in the terminal" },
]

const args = process.argv.slice(2)
const command = args.reduce((result, arg) => {
  const cmd = commands.find(({ name }) => name === arg)
  if (!result.name && cmd) {
    return { ...cmd, ...result }
  }

  const flag = flags.find(({ name }) => `--${name}` == arg)
  if (flag) {
    return { [flag.name]: true, ...result }
  }

  console.error(`Argument ${arg} is invalid.\n`)
  return { help: true }
}, {})

if (!command.name || command.help) {
  console.info("Usage: boring-blocks <command>")
  console.info("\nAvailable commands:")
  commands.forEach(({ name, description }) => {
    console.info(`  ${name}: ${description}`)
  })
  console.info("\nAvailable flags:")
  flags.forEach(({ name, description }) => {
    console.info(`  --${name}: ${description}`)
  })
  process.exit(1)
}

console.info(`ℹ️ Running boring-blocks ${command.name}...`)

spawnSync(`node ${command.script}`, {
  cwd: import.meta.dirname,
  stdio: command.verbose ? "inherit" : "pipe",
  shell: true,
})
