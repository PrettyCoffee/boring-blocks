import { spawn } from "node:child_process"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")

const printHeadline = text => {
  const divider = "-".repeat(text.length + 1)
  process.stdout.write("\n")
  process.stdout.write(`${divider}\n`)
  process.stdout.write(` ${text}\n`)
  process.stdout.write(`${divider}\n`)
  process.stdout.write("\n")
}

const run = cmd =>
  new Promise((resolve, reject) => {
    const child = spawn(`pnpm exec ${cmd}`, {
      cwd: root,
      shell: true,
      stdio: "inherit",
    })

    child.on("error", reject)

    child.on("close", code => {
      if (code !== 0) process.exit(1)
      resolve()
    })
  })

printHeadline("🛠️ Bundling javascript")
await run("vite build")

printHeadline("🛠️ Transpiling types")
await run(
  "tsc -p ./tsconfig.lib.json --outDir ./dist --noEmit false --declaration --emitDeclarationOnly"
)
