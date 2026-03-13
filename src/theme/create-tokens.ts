import { flatten } from "./utils/flatten"

export interface TokenItem {
  [key: string]: TokenItem | string | number
}

export class ThemeTokens<
  TVariantName extends string = string,
  TTokens extends TokenItem = TokenItem,
> {
  constructor(
    public readonly defaultVariant: TVariantName,
    public readonly variants: Record<TVariantName, TTokens>
  ) {}

  public addVariant<TName extends string>(name: TName, tokens: TTokens) {
    const variants = {
      ...this.variants,
      [name]: tokens,
    } as Record<TVariantName | TName, TTokens>

    return new ThemeTokens<TVariantName | TName, TTokens>(
      this.defaultVariant,
      variants
    )
  }

  public flatten() {
    const flat = Object.fromEntries(
      Object.entries(this.variants).map(([name, tokens]) => [
        name,
        flatten(tokens as TTokens),
      ])
    )

    return flat as Record<TVariantName, (typeof flat)[string]>
  }
}

class ThemeTokensWithoutVariant {
  public addVariant<
    TVariantName extends string,
    TVariantTokens extends TokenItem,
  >(name: TVariantName, tokens: TVariantTokens) {
    const noVariant = {} as Record<TVariantName, TVariantTokens>
    return new ThemeTokens(name, noVariant).addVariant(name, tokens)
  }
}

export const createTokens = () => new ThemeTokensWithoutVariant()
