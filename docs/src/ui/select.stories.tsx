import { useState } from "react"

import { type Meta, type StoryObj } from "@storybook/react-vite"
import { Select } from "boring-blocks"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/Select",
  component: Select.Root,
  subcomponents: {
    "Select.Option": Select.Option,
    "Select.Group": Select.Group,
    "Select.Separator": Select.Separator,
  },
  argTypes: {
    value: argType.disabled(),
    onChange: argType.callback(),
    caption: argType.string(),
    placeholder: argType.string(),
    alignItemWithTrigger: argType.boolean(),
    clearOption: argType.boolean(),
  },
  args: {
    onChange: action("Select.Root.onChange"),
    placeholder: "No option",
    clearOption: true,
  },
} satisfies Meta<typeof Select.Root>

export default meta

type Story = StoryObj<typeof meta>

const groups: Record<string, string> = {
  "Group 1": "text-category-blue",
  "Group 2": "text-category-green",
  "Group 3": "text-category-rose",
}
const options = ["Option 1", "Option 2", "Option 3", "Option 4"]

const OptionLabel = ({ value }: { value: string }) => {
  if (!value.includes(" - ")) return value

  const [prefix, item] = value.split(" - ")
  return (
    <span className="*:not-last:hidden [[role='combobox']_&_*]:inline">
      {prefix && (
        <>
          <span className={groups[prefix]}>{prefix}</span>
          <span> - </span>
        </>
      )}
      <span>{item}</span>
    </span>
  )
}

const Options = ({ prefix }: { prefix?: string }) => (
  <>
    {options.map(option => {
      const value = [prefix, option].filter(Boolean).join(" - ")
      return (
        <Select.Option key={option} value={value} label={option}>
          <OptionLabel value={value} />
        </Select.Option>
      )
    })}
  </>
)

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox"))
  },
  render: args => {
    const [value, setValue] = useState(options[1])
    return (
      <Select.Root
        {...args}
        value={value}
        onChange={(value, details) => {
          setValue(value ?? "")
          args.onChange(value, details)
        }}
      >
        <Options />
      </Select.Root>
    )
  },
}

export const WithGroups: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox"))
  },
  render: args => {
    const [value, setValue] = useState("Group 1 - Option 2")
    return (
      <Select.Root
        {...args}
        caption={!value ? undefined : <OptionLabel value={value} />}
        value={value}
        onChange={(value, details) => {
          setValue(value ?? "")
          args.onChange(value, details)
        }}
      >
        {Object.entries(groups).map(([group, color]) => (
          <Select.Group key={group} label={group} labelClassName={color}>
            <Options prefix={group} />
          </Select.Group>
        ))}
      </Select.Root>
    )
  },
}
