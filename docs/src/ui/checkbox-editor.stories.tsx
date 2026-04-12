import { useState } from "react"

import { type Meta, type StoryObj } from "@storybook/react-vite"
import {
  Checkbox,
  CheckboxEditor,
  hstack,
  Toggle,
  vstack,
  type CheckboxEditorProps,
} from "boring-blocks"
import { cn } from "boring-blocks/utils"
import { action } from "storybook/actions"

import { argType } from "../utils/arg-type"

const meta = {
  title: "Inputs/CheckboxEditor",
  component: CheckboxEditor,
  argTypes: {
    checked: argType.disabled(),
    initialChecked: argType.disabled(),
    onCheckedChange: argType.callback(),

    label: argType.string(),
    onLabelChange: argType.callback(),
    placeholder: argType.string(),
  },
  args: {
    placeholder: "Start typing...",
    onCheckedChange: action("onCheckedChange"),
    onEnterDown: action("onEnterDown"),
    onLabelChange: action("onLabelChange"),
  },
} satisfies Meta<typeof CheckboxEditor>

export default meta

type Story = StoryObj<typeof meta>

const longLabel =
  "a very long label that will cause the text to overflow the component and end up in ellipsis if everything is styled correctly. This part here shouldn't be visible."

interface ListItem {
  checked: NonNullable<CheckboxEditorProps["checked"]>
  label: string
}

export const Default: Story = {
  render: function Default(args: CheckboxEditorProps) {
    const [editable, setEditable] = useState(true)
    const [list, setList] = useState<ListItem[]>([
      { checked: true, label: "Checked with a label" },
      { checked: "indeterminate", label: `Indeterminate with ${longLabel}` },
      { checked: false, label: `Unchecked with ${longLabel}` },
    ])

    const update = (index: number, value: Partial<ListItem>) => {
      setList(prev => {
        const state = [...prev]
        if (state[index]) {
          state[index] = { ...state[index], ...value }
        }
        return state
      })
    }

    return (
      <>
        <Toggle
          label="Editable"
          checked={editable}
          onChange={setEditable}
          className="mb-2"
        />
        <div className={cn(vstack({ gap: 2 }))}>
          {list.map(({ checked, label }, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key -- order is fixed
              key={index}
              className={cn(hstack({ gap: 2 }))}
            >
              {editable && (
                <CheckboxEditor
                  {...args}
                  checked={checked}
                  label={label}
                  onCheckedChange={checked => update(index, { checked })}
                  onLabelChange={label => update(index, { label })}
                  className="max-w-96"
                />
              )}
              {!editable && (
                <Checkbox
                  {...args}
                  checked={checked}
                  label={label}
                  onCheckedChange={checked => update(index, { checked })}
                  className="max-w-96"
                />
              )}
            </div>
          ))}
        </div>
      </>
    )
  },
}
