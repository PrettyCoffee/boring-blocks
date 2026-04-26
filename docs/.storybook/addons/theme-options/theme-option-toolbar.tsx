// @ts-ignore -- We need to import React for JSX support in Storybook internals
import React, { useEffect, useRef, useState } from "react"

import { RangeControl, BooleanControl } from "@storybook/addon-docs/blocks"
import { PaintBrushIcon } from "@storybook/icons"
import { Button, type ButtonProps } from "storybook/internal/components"
import { css, styled } from "storybook/theming"

import { themeOptions } from "./theme-options"
import { theme } from "../../../../src/theme"
import { useAtom } from "../../../src/lib/yaasl"

const colors = {
  neutral: theme.tokens.variants.dark.color.text.priority,
  ...theme.tokens.variants.dark.color.category,
}

const MenuButton = styled(Button)<ButtonProps & { isOpen?: boolean }>(
  ({ isOpen, theme }) => [
    css`
      height: 28px;
      width: 28px;
      padding: 0;
      display: inline-grid;
      place-content: center;
    `,
    isOpen &&
      css`
        background: color-mix(
          in srgb,
          ${theme.barSelectedColor} 7%,
          transparent
        );
        color: ${theme.color.secondary};
      `,
  ]
)

const ColorSwatch = styled.button(
  ({ theme }) => css`
    height: 24px;
    min-width: 24px;
    border-radius: ${theme.appBorderRadius + 2}px;
    border: none;
    outline: none;
    filter: drop-shadow(0px 5px 5px rgba(0, 0, 0, 0.05))
      drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
    cursor: pointer;

    --opacity: 50%;
    background-color: color-mix(
      in srgb,
      var(--color-value) var(--opacity),
      transparent
    );
    :hover {
      --opacity: 75%;
    }
    :active {
      --opacity: 100%;
    }

    display: inline-grid;
    place-content: center;
    &[aria-current]::before {
      content: "✓";
    }
  `
)

const ColorsWrapper = styled.div`
  display: grid;
  gap: 0.25rem;
  grid-template-columns: repeat(4, 1fr);
  place-content: start;
`

const PopoverWrapper = styled.div(
  ({ theme }) => css`
    width: 240px;
    margin-top: 4px;
    border-radius: ${theme.appBorderRadius + 2}px;
    font-size: ${theme.typography.size.s1}px;
    background: ${theme.background.app};
    color: ${theme.color.defaultText};
    border: 1px solid ${theme.appBorderColor};
    position-area: bottom;
    filter: drop-shadow(0px 5px 5px rgba(0, 0, 0, 0.05))
      drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
  `,
  {}
)
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0 0.5rem 0.5rem 0.5rem;
  :first-of-type {
    margin-top: 0.5rem;
  }
`

export const ThemeOptionToolbar = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { accent, radius, colored } = useAtom(themeOptions)

  useEffect(() => {
    const element = ref.current
    const handler = (event: ToggleEvent) => setIsOpen(event.newState === "open")
    element?.addEventListener("beforetoggle", handler)
    return () => {
      element?.removeEventListener("beforetoggle", handler)
    }
  }, [])

  return (
    <>
      <MenuButton
        variant="ghost"
        popoverTarget="toggle-popover"
        isOpen={isOpen}
        aria-expanded={isOpen}
        title="Theming"
      >
        <PaintBrushIcon />
      </MenuButton>

      <PopoverWrapper ref={ref} id="toggle-popover" popover="auto">
        <Section>
          Border Radius
          <RangeControl
            name="radius"
            min={0}
            max={16}
            value={radius}
            onChange={value => {
              themeOptions.set(prev => ({ ...prev, radius: value ?? 0 }))
              if (!value) return
              document.documentElement.style.setProperty(
                "--tw-theme-radius",
                String(value)
              )
            }}
          />
        </Section>

        <Section>
          Accent Color
          <ColorsWrapper>
            {Object.entries(colors).map(([name, value]) => (
              <ColorSwatch
                key={name}
                title={name}
                aria-current={accent === name ? "true" : undefined}
                style={{
                  // @ts-expect-error -- bad typing
                  "--color-value": value,
                }}
                onClick={() => {
                  themeOptions.set(prev => ({
                    ...prev,
                    accent: name as keyof typeof colors,
                  }))
                }}
              />
            ))}
          </ColorsWrapper>
        </Section>

        <Section as="label">
          Colored Base Colors
          <div>
            <BooleanControl
              name="colored"
              value={colored}
              onChange={(colored = false) => {
                themeOptions.set(prev => ({ ...prev, colored }))
              }}
            />
          </div>
        </Section>

        <Section>
          Reset
          <Button onClick={() => themeOptions.set(themeOptions.defaultValue)}>
            Reset Values
          </Button>
        </Section>
      </PopoverWrapper>
    </>
  )
}
