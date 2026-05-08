import { Component, type ReactNode } from "react"

import { msg } from "@lingui/core/macro"

import { useTrans } from "../../locales"

const DefaultFallback = () => (
  <div
    className="grid size-10 place-content-center"
    title={useTrans(msg`An unexpected error occurred here`)}
  >
    💥
  </div>
)

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onCatch?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  error: null | Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onCatch } = this.props
    onCatch?.(error, errorInfo)
    console.error("Uncaught error:", error, errorInfo)
  }

  componentDidUpdate(prevProps: Props) {
    const { children } = this.props
    if (children !== prevProps.children) {
      this.setState({ error: null })
    }
  }

  render() {
    const { children, fallback = <DefaultFallback /> } = this.props
    const { error } = this.state
    return !error ? children : fallback
  }
}
