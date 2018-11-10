import React, { Component } from "react";
import p5 from "p5";

class P5Wrapper extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }

  componentDidMount() {
    this.canva = new p5(this.props.sketch, this.wrapper.current);
    this.canva.customCallbackHandler = this.props.callback;
    if (this.canva.customRedrawHandler) {
      this.canva.customRedrawHandler(this.props.values);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.sketch !== prevProps.sketch) {
      this.canva.remove();
      this.canvas = new p5(this.props.sketch, this.wrapper);
      this.canva.customCallbackHandler = this.props.callback;
    }
    if (this.canva.customRedrawHandler) {
      this.canva.customRedrawHandler(this.props.values);
    }
  }

  componentWillUnmount() {
    this.canva.remove();
  }

  render() {
    return <div ref={this.wrapper} />;
  }
}

export default P5Wrapper;
