import { Component, ReactNode } from 'react'

type State = { hasError: boolean }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: any, info: any) { console.error('ErrorBoundary caught', error, info) }
  render() {
    if (this.state.hasError) return <div style={{ padding: 24 }}>Something went wrong.</div>
    return this.props.children
  }
}
