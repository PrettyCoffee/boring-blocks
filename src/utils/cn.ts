import {
  mergeConfigs,
  extendTailwindMerge,
  type Config,
  twJoin,
  type ClassNameValue,
} from "tailwind-merge"

const withBgl = <ClassGroupIds extends string, ThemeGroupIds extends string>(
  prevConfig: Config<ClassGroupIds, ThemeGroupIds>
) =>
  mergeConfigs(prevConfig, {
    extend: {
      classGroups: {
        "bgl-base": [{ bgl: [(key: string) => key.startsWith("base")] }],
        "bgl-layer": [{ bgl: [(key: string) => key.startsWith("layer")] }],
      },
      conflictingClassGroups: {
        "bg-color": ["bgl-base", "bgl-layer"],
      },
    },
  })

const twMerge = extendTailwindMerge(withBgl)

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(twJoin(inputs))
}
