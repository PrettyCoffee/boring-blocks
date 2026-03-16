// @ts-ignore -- We need to import React for JSX support in Storybook internals
import React from "react"

import { css, styled } from "storybook/theming"

import { darkMode } from "./darkMode"
import { useAtom } from "../../../src/lib/yaasl"

const ToggleButton = styled.button(
  ({ theme: { barHoverColor, appBorderRadius } }) => css`
    width: 28px;
    height: 28px;
    padding: 1px;
    display: inline-grid;
    place-content: center;
    border: none;
    background: transparent;
    cursor: pointer;

    position: relative;

    ::after {
      content: "";
      display: inline-block;
      position: absolute;
      inset: 0;
      border-radius: ${appBorderRadius}px;
      --opacity: 0%;
      background: color-mix(
        in srgb,
        ${barHoverColor} var(--opacity),
        transparent
      );
    }
    :hover::after {
      --opacity: 15%;
    }
    :active::after {
      --opacity: 25%;
    }

    > img {
      z-index: 1;
      height: 100%;
      width: 100%;
      opacity: 0.5;
    }
    :hover > img {
      opacity: 0.9;
    }
    :active > img {
      opacity: 1;
    }
  `
)

export const DarkModeToggle = () => {
  const isDarkMode = useAtom(darkMode)

  return (
    <ToggleButton
      key="dark-mode-toggle"
      title={
        isDarkMode ? "Change theme to light mode" : "Change theme to dark mode"
      }
      onClick={() => darkMode.set(!isDarkMode)}
    >
      {isDarkMode ? (
        <img src="./moon.png" alt="dark mode" />
      ) : (
        <img src="./sun.png" alt="light mode" />
      )}
    </ToggleButton>
  )
}
