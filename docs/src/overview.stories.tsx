import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Calendar,
  Card,
  Checklist,
  ContextInfo,
  DateInput,
  FileInput,
  IconButton,
  List,
  Toggle,
  TimeInput,
  Spinner,
  TextInput,
  Masonry,
  vstack,
  hstack,
  TextArea,
  HoldButton,
  Slider,
} from "boring-blocks"
import {
  GripHorizontalIcon,
  HelpCircleIcon,
  HandGrabIcon,
  HandIcon,
} from "boring-blocks/icons"
import { cn } from "boring-blocks/utils"

import { useDarkMode } from "../.storybook/addons/dark-mode"
import { darkMode } from "../.storybook/addons/dark-mode/darkMode"
import { useThemeOptions } from "../.storybook/addons/theme-options"
import { themeOptions } from "../.storybook/addons/theme-options/theme-options"

const meta = { title: "Overview" } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const ChecklistCard = () => (
  <Card className="p-2 pt-1">
    <Checklist
      title="ToDos"
      onChange={() => null}
      items={[
        { id: "1", checked: true, label: "Create components" },
        { id: "2", checked: false, label: "Write documentation" },
        { id: "3", checked: false, label: "Review code" },
      ]}
    />
  </Card>
)

const LoginCard = () => {
  const [password, setPassword] = useState("")
  return (
    <Card title="Login" description="Send me your credentials. Please? :)">
      <IconButton
        title="Open Help"
        icon={HelpCircleIcon}
        size="sm"
        className="absolute top-1 right-1"
      />

      <div className={vstack({ gap: 4 })}>
        <TextInput placeholder="Username" />
        <TextInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />

        <div className="flex gap-4 *:flex-1">
          <Button look="ghost">Cancel</Button>
          <Button look="key">Send</Button>
        </div>
      </div>
    </Card>
  )
}

const SettingsCard = () => {
  const theme = useThemeOptions()
  const dark = useDarkMode()
  return (
    <Card title="Settings" description="Change the colors of components.">
      <div className={cn(vstack({ gap: 2 }))}>
        <Toggle
          label="Dark mode"
          checked={dark}
          onChange={dark => darkMode.set(dark)}
        />
        <Toggle
          label="Colored base colors"
          checked={theme.colored}
          onChange={colored => themeOptions.set(prev => ({ ...prev, colored }))}
        />
        <Slider
          label="Corner Radius"
          unit="px"
          value={theme.radius}
          onChange={radius => themeOptions.set(prev => ({ ...prev, radius }))}
          min={0}
          max={16}
        />
        <div>
          <HoldButton
            look="destructive"
            onClick={() => {
              darkMode.set(darkMode.defaultValue)
              themeOptions.set(themeOptions.defaultValue)
            }}
            captions={{
              idle: "Hold to reset",
              holding: "About to reset...",
              triggered: "Theme was reset",
            }}
          />
        </div>
      </div>
    </Card>
  )
}

const DataCard = () => (
  <Card title="File Upload" description="Upload your files to secure them.">
    <FileInput className="w-full" />
    <span className="text-xs text-text-muted">
      There is no data protection tho...
    </span>
  </Card>
)

const MeetingCard = () => (
  <Card title="Schedule Meeting">
    <div className={cn(vstack({ gap: 2 }))}>
      <TextInput placeholder="Title" />
      <div className={hstack({ gap: 2, align: "center" })}>
        <DateInput className="flex-1" />
        <TimeInput className="flex-1" />
        {" – "}
        <TimeInput className="flex-1" />
      </div>
      <TextArea
        placeholder="Description"
        autoGrow={{ minLines: 5, maxLines: 10 }}
      />
    </div>
  </Card>
)

const CalendarCard = () => (
  <Card title="Calendar" description="Select a date you like.">
    <div className="grid place-items-center">
      <Calendar />
    </div>
  </Card>
)

const SearchCard = () => (
  <Card title="Search">
    <TextInput
      type="search"
      placeholder="Search"
      value="Bliblablub"
      className="mb-4"
    />
    <ContextInfo label="No matching data" />
  </Card>
)

const Item = ({ name }: { name: string }) => {
  const [hold, setHold] = useState(false)
  return (
    <List.Item>
      <IconButton
        title="Sort"
        hideTitle
        onClick={() => null}
        icon={GripHorizontalIcon}
        iconColor="gentle"
        className="cursor-grab active:cursor-grabbing"
      />
      <List.Label label={name} />
      <List.Action
        icon={hold ? HandGrabIcon : HandIcon}
        title="Pet"
        onClick={() => null}
        onPointerDown={() => setHold(true)}
        onPointerUp={() => setHold(false)}
      />
    </List.Item>
  )
}

const TeamCard = () => (
  <Card title="My Team">
    <List.Group>
      {["Banette", "Mimikyu", "Mareanie", "Swanna", "Golduck", "Leafeon"].map(
        item => (
          <Item key={item} name={item} />
        )
      )}
    </List.Group>
  </Card>
)

const LoadingCard = () => (
  <Card title="Loading More...">
    <Spinner size="xl" centered />
  </Card>
)

export const Overview: Story = {
  render: () => (
    <div className="[*:has(&)]:bg-background-page!">
      <Masonry.Grid minColumnWidth={270} gap={16}>
        <Masonry.Item>
          <ChecklistCard />
        </Masonry.Item>
        <Masonry.Item>
          <LoginCard />
        </Masonry.Item>
        <Masonry.Item>
          <SettingsCard />
        </Masonry.Item>
        <Masonry.Item>
          <DataCard />
        </Masonry.Item>
        <Masonry.Item>
          <MeetingCard />
        </Masonry.Item>
        <Masonry.Item>
          <SearchCard />
        </Masonry.Item>
        <Masonry.Item>
          <CalendarCard />
        </Masonry.Item>
        <Masonry.Item>
          <TeamCard />
        </Masonry.Item>
        <Masonry.Item>
          <LoadingCard />
        </Masonry.Item>
      </Masonry.Grid>
    </div>
  ),
}
