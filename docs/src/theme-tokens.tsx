import { Fragment } from "react/jsx-runtime"
import { styled, Global } from "storybook/theming"

import { theme } from "../../src"
import { useDarkMode } from "../.storybook/addons/dark-mode"

type TokenName = Parameters<typeof theme.read>[0]
interface DemoProps {
  name: TokenName
  invert?: boolean
}

export const ProvideTheme = () => {
  const isDarkMode = useDarkMode()
  return (
    <Global
      styles={{
        ":root": { ...theme.getCssVars(isDarkMode ? "dark" : "light") },
        ".sbdocs.sbdocs-wrapper": {
          background: theme.read("color.background.page"),
        },
      }}
    />
  )
}

export const DemoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem auto;
  max-width: max-content;
`

const DemoBase = styled.div`
  height: 6rem;
  width: 6rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
  overflow: hidden;
  border-radius: ${theme.read("radius", "calc(<var> / 16 * 1rem)")};
  color: ${theme.read("color.text.default")};
`

export const Placeholder = () => <DemoBase />

const splitName = (name: string) =>
  name.split(".").map(part => (
    <Fragment key={part}>
      {part}
      <br />
    </Fragment>
  ))

export const TextDemo = ({ name, invert }: DemoProps) => {
  const color = theme.read(name)
  const background = theme.read(
    invert ? "color.background.invert" : "color.background.default"
  )
  return <DemoBase style={{ color, background }}>{splitName(name)}</DemoBase>
}

export const BackgroundDemo = ({ name, invert }: DemoProps) => {
  const color = theme.read(invert ? "color.text.invert" : "color.text.default")
  const background = theme.read(name)
  return <DemoBase style={{ color, background }}>{splitName(name)}</DemoBase>
}

export const StrokeDemo = ({ name }: DemoProps) => {
  const border = `1px solid ${theme.read(name)}`
  return <DemoBase style={{ border }}>{splitName(name)}</DemoBase>
}

export const AlertDemo = ({ name }: DemoProps) => {
  const border = `1px solid ${theme.read(name)}`
  return <DemoBase style={{ border }}>{splitName(name)}</DemoBase>
}

const RotateText = styled.span`
  display: inline-block;
  rotate: 90deg;
  font: inherit;
  transform-origin: 0.5rem 0.75rem;
`
export const CategoryDemo = ({ name }: DemoProps) => {
  const outline = `1px solid ${theme.read(name)}`
  return (
    <DemoBase style={{ outline, width: "2.5rem" }}>
      <RotateText>{splitName(name).at(-1)}</RotateText>
    </DemoBase>
  )
}
