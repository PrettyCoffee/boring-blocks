import { exec } from "node:child_process"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")

const run = cmd =>
  new Promise((resolve, reject) => {
    exec(cmd, { cwd: root, encoding: "utf-8" }, (error, stdout, stderr) => {
      if (!error) return resolve(stdout)
      return reject(stderr)
    })
  })

await run("vite build")
await run(
  "tsc -p ./tsconfig.lib.json --outDir ./dist --noEmit false --declaration --emitDeclarationOnly"
)
