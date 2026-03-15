import type { InputType } from "storybook/internal/types"

const createArgTypes = <T extends Record<string, (args: any) => InputType>>(
  argTypes: T
) => argTypes

const prop = (input: InputType) => ({
  ...input,
  table: { ...input.table, category: "Props" },
})

const callback = (input: InputType) => ({
  ...input,
  table: { ...input.table, category: "Callbacks" },
})

const optionsToArgTypes = (options?: Record<string, unknown> | unknown[]) => {
  if (!options) return undefined
  if (Array.isArray(options)) return { options }

  const keys = Object.keys(options)
  return { options: keys, mapping: options }
}

/** Helper to create storybook argTypes */
export const argType = createArgTypes({
  string: () => prop({ control: "text" }),
  number: () => prop({ control: "number" }),
  boolean: () => prop({ control: "boolean" }),
  enum: (
    type: "radio" | "select" = "radio",
    options?: Record<string, unknown> | unknown[]
  ) =>
    prop({
      control: type,
      ...optionsToArgTypes(options),
    }),

  callback: () => callback({ control: false }),

  disabled: () => prop({ control: false }),
  hidden: () => ({ table: { disable: true } }),
})
