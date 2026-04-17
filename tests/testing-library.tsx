import "@testing-library/jest-dom/vitest"

import { type ReactNode, type PropsWithChildren, Fragment } from "react"

import {
  screen as screenRtl,
  render as renderRtl,
  renderHook as renderHookRtl,
  type RenderHookOptions,
  type RenderOptions,
} from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

import { iconMatchers } from "./icon-matchers"
import { DialogProvider } from "../src"

const withProviders = (options: RenderOptions = {}): RenderOptions => {
  const Wrapper = options.wrapper ?? Fragment
  const WrapperWithProviders = ({ children, ...props }: PropsWithChildren) => (
    <>
      <Wrapper {...props}>{children}</Wrapper>
      <DialogProvider />
    </>
  )

  return {
    ...options,
    wrapper: WrapperWithProviders,
  }
}

export * from "@testing-library/react"

export const render = (ui: ReactNode, options?: RenderOptions) => ({
  ...renderRtl(ui, withProviders(options)),
  user: userEvent.setup(),
})

export const renderHook = <Result, Props>(
  hookFn: (props: Props) => Result,
  options?: RenderHookOptions<Props>
) => renderHookRtl<Result, Props>(hookFn, withProviders(options))

export const screen = Object.assign(screenRtl, iconMatchers)
