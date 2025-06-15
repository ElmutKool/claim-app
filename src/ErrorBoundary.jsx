import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Rendering error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 style={{ padding: '50px', textAlign: 'center' }}>Something went wrong 😵</h1>;
    }
    return this.props.children;
  }
}
