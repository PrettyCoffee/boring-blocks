import { fileURLToPath } from "node:url"

export const previewAnnotations = (entry = []) => [...entry]

export const managerEntries = (entry = []) => [
  ...entry,
  fileURLToPath(import.meta.resolve("./dark-mode/manager.ts")),
]
