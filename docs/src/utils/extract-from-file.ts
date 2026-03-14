const OPEN_TAG = "doc-snippet>>"
const CLOSE_TAG = "<<doc-snippet"

const hasTag = (line: string) =>
  line.includes(OPEN_TAG) || line.includes(CLOSE_TAG)

export const extractFromFile = (
  fileContent: string,
  tagId?: string
): string => {
  const lines = fileContent.split(/\n/g)

  if (!tagId) {
    return lines.filter(line => !hasTag(line)).join("\n")
  }

  const startLine =
    lines.findIndex(line => line.includes(`${OPEN_TAG} ${tagId}`)) + 1
  const endLine = lines.findIndex(line =>
    line.includes(`${CLOSE_TAG} ${tagId}`)
  )

  const indentationToRemove = lines[startLine]?.search(/\S/)

  return lines
    .slice(startLine, endLine)
    .filter(line => !hasTag(line))
    .map(line => line.slice(indentationToRemove))
    .join("\n")
}
