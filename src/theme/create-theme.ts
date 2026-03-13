import type { ThemeConfig } from "tailwindcss/plugin.js"

import { ThemeTokens } from "./create-tokens"
import { parseColor, toOklch } from "./utils/color"
import { ObjDeepPath, ObjDeepValue } from "./utils/flatten"

type CustomThemeConfig = ThemeConfig["extend"]

export type TokenNames<TTokens extends ThemeTokens> =
  TTokens extends ThemeTokens<string, infer Tokens>
    ? ObjDeepPath<Tokens>
    : never

export type TokenVariants<TTokens extends ThemeTokens> =
  TTokens extends ThemeTokens<infer VariantName, any> ? VariantName : never

interface CreateThemeVariant<TTokens extends ThemeTokens, TTwTheme> {
  /** The underlying css theme with all possible values.
   *  Will be used to write css variables.
   **/
  tokens: TTokens
  /** Function to retrieve the tokens which are used in tailwind */
  twTheme: (
    get: (
      path: TokenNames<TTokens>,
      extra?: `${string}<var>${string}`
    ) => string
  ) => TTwTheme
}

interface GeneralThemeOptions<TTokens extends ThemeTokens> {
  /** Prefix for css variables */
  prefix: string
  /** Paths pointing to values that should be handled as colors */
  colorPath: TokenNames<TTokens> | TokenNames<TTokens>[]
}
interface ThemeConstructorProps<TTokens extends ThemeTokens, TTwTheme>
  extends
    Partial<GeneralThemeOptions<TTokens>>,
    CreateThemeVariant<TTokens, TTwTheme> {}

const getCssVar = <TTokens extends ThemeTokens>(
  prefix: string,
  path: TokenNames<TTokens>
) => {
  const varPrefix = prefix ? `--${prefix}-theme` : "--theme"
  return `${varPrefix}-${path.replaceAll(".", "-")}`
}

const readVar = <TTokens extends ThemeTokens>(
  { prefix, colorPath }: GeneralThemeOptions<TTokens>,
  path: TokenNames<TTokens>,
  extra?: `${string}<var>${string}`
) => {
  const isColor = [colorPath]
    .flat()
    .some(colorPath => path.startsWith(`${colorPath}.`) || path === colorPath)

  let cssVar = `var(${getCssVar(prefix, path)})`
  if (isColor) cssVar = `oklch(${cssVar})`
  if (extra) cssVar = extra.replaceAll("<var>", cssVar)
  return cssVar
}

export class Theme<
  TTokens extends ThemeTokens = ThemeTokens,
  TTwTheme extends Partial<CustomThemeConfig> = Partial<CustomThemeConfig>,
> {
  public readonly options: GeneralThemeOptions<TTokens>

  public readonly tokens: TTokens
  public readonly twTheme: TTwTheme

  constructor({
    prefix = "tw",
    colorPath = ["color", "colors"] as TokenNames<TTokens>[],
    tokens,
    twTheme,
  }: ThemeConstructorProps<TTokens, TTwTheme>) {
    this.options = {
      prefix,
      colorPath,
    }

    this.tokens = tokens
    this.twTheme = twTheme((path, extra) => readVar(this.options, path, extra))
  }

  public getCssVar(path: TokenNames<TTokens>) {
    return getCssVar<TTokens>(this.options.prefix, path)
  }

  public read(path: TokenNames<TTokens>, extra?: `${string}<var>${string}`) {
    return readVar<TTokens>(this.options, path, extra)
  }

  public set<TPath extends TokenNames<TTokens>>(
    element: HTMLElement,
    path: TPath,
    value: ObjDeepValue<TTokens, TPath>
  ) {
    const cssVar = this.getCssVar(path)
    element.style.setProperty(cssVar, String(value))
  }

  public getCssVars(variantName?: TokenVariants<TTokens>) {
    const flat = this.tokens.flatten()
    const variant = variantName
      ? flat[variantName]
      : flat[this.tokens.defaultVariant]

    if (!variant)
      throw new Error(`Theme variant "${variantName}" doesn't exist.`)

    return Object.fromEntries(
      Object.entries(variant).map(([name, value]) => {
        const varName = this.getCssVar(name as TokenNames<TTokens>)
        const stringValue = String(value as string)
        try {
          const { color } = toOklch(parseColor(stringValue))
          return [varName, color.join(" ")]
        } catch {
          return [varName, stringValue]
        }
      })
    )
  }
}

export const createTheme = <
  TTokens extends ThemeTokens,
  TTwTheme extends Partial<CustomThemeConfig>,
>(
  props: ThemeConstructorProps<TTokens, TTwTheme>
) => new Theme(props)
