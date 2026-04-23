import { faker } from "@faker-js/faker"
import { type StoryObj, type Meta } from "@storybook/react-vite"
import { IconButton, List, type ListItemProps } from "boring-blocks"
import { Circle, GripHorizontal, SquarePen, Trash } from "lucide-react"
import { action } from "storybook/actions"

import { type IconProp } from "../../../src/types/base-props"

faker.seed(1337)

const meta = {
  title: "Primitives/List",
  component: List.Group,
  subcomponents: {
    "List.Item": List.Item,
    "List.Label": List.Label,
    "List.Action": List.Action,
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof List.Group>

export default meta

type Story = StoryObj<typeof meta>

const Item = ({ icon, ...props }: ListItemProps & IconProp) => (
  <List.Item {...props}>
    <IconButton
      icon={GripHorizontal}
      title="Re-order"
      hideTitle
      className="cursor-grab active:cursor-grabbing"
      onClick={action("List.Item > IconButton.onClick")}
    />
    <List.Label
      icon={icon}
      label={faker.lorem.words({ min: 2, max: 3 })}
      onClick={action("List.Label.onClick")}
    />
    <List.Action
      icon={SquarePen}
      title="Edit"
      onClick={action("List.Action.onClick")}
    />
    <List.Action
      icon={Trash}
      title="Delete"
      onClick={action("List.Action.onClick")}
    />
  </List.Item>
)

export const Default: Story = {
  name: "List",
  render: args => (
    <List.Group {...args} className="max-w-64">
      <Item />
      <Item active />
      <Item icon={Circle} />
    </List.Group>
  ),
}
