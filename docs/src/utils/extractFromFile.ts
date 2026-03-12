import pkg from "../../package.json";

const OPEN_TAG = "doc-snippet>>";
const CLOSE_TAG = "<<doc-snippet";

const importReplacements: Record<string, string> = {
  "../../src": pkg.name,
};
const adjustImportSource = (code: string) => {
  const importRegex = /import.+from\s+['"]([^'"]+)['"]/g;
  return code.replaceAll(importRegex, (match, source: string) => {
    const replacement = importReplacements[source];
    return !replacement ? match : match.replace(source, replacement);
  });
};

const hasTag = (line: string) =>
  line.includes(OPEN_TAG) || line.includes(CLOSE_TAG);

export const extractFromFile = (
  fileContent: string,
  tagId?: string,
): string => {
  const lines = fileContent.split(/\n/g);

  if (!tagId) {
    return lines
      .filter((line) => !hasTag(line))
      .map(adjustImportSource)
      .join("\n");
  }

  const startLine =
    lines.findIndex((line) => line.includes(`${OPEN_TAG} ${tagId}`)) + 1;
  const endLine = lines.findIndex((line) =>
    line.includes(`${CLOSE_TAG} ${tagId}`),
  );

  const indentationToRemove = lines[startLine]?.search(/\S/);

  return lines
    .slice(startLine, endLine)
    .filter((line) => !hasTag(line))
    .map((line) => line.slice(indentationToRemove))
    .map(adjustImportSource)
    .join("\n");
};
