import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="container">
          <div className="card card-error">
            <div className="h2">App crashed</div>
            <div className="muted" style={{ marginTop: 8 }}>
              Copy this and send it to me:
            </div>
            <pre className="pre">{String(this.state.error?.message || this.state.error)}</pre>
            <button className="btn" onClick={() => location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
