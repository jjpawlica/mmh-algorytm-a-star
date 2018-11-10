import React, { Component } from "react";
import P5Wrapper from "./P5Wrapper";

import sketch from "./sketches/sketch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateSketch: sketch
    };
  }

  render() {
    return (
      <div>
        <h1>Implementacja algorytmu A*</h1>
        <h2>Metody metaheurystyczne</h2>
        <P5Wrapper
          sketch={this.state.stateSketch}
          values={{
            search: this.state.search
          }}
          callback={this.stateChange}
        />
      </div>
    );
  }
}

export default App;
