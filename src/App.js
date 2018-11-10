import React, { Component } from "react";
import P5Wrapper from "./P5Wrapper";

import sketch from "./sketches/sketch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Wielkość siatki
      gridSize: 20,
      // Częstość występowania przeszkód
      wallFrequency: 20,
      // Czy algorytm wyszukuje rozwiązania
      isSearching: false,
      // Czy algorytm znalazł rozwiąznie
      isDone: false,
      // Wiadomość do wyświetlenia
      message: "Rozpocznij szukanie",
      // Zaimportowany sketch
      stateSketch: sketch
    };
  }

  // Funckja wywoływana przy zmianie wielkości siatki
  gridSizeChange = event =>
    this.setState({
      gridSize: event.target.value,
      isSearching: false,
      message: "Rozpocznij szukanie"
    });

  // Funckja wywoływana przy zmianie częstości występowania przeszkód
  wallFrequencyChange = event =>
    this.setState({
      wallFrequency: event.target.value,
      isSearching: false,
      message: "Rozpocznij szukanie"
    });

  // Funkcjka uruchamiająca i zatrzymująca algorytm
  toggleSearch = () => {
    this.setState({
      isSearching: !this.state.isSearching,
      message: "Rozpocznij szukanie"
    });
  };

  stateChange = (newState, callback) => this.setState(newState, callback);

  render() {
    return (
      <div>
        <h1>Implementacja algorytmu A*</h1>
        <h2>Metody metaheurystyczne</h2>
        <P5Wrapper
          sketch={this.state.stateSketch}
          values={{
            gridSize: this.state.gridSize,
            wallFrequency: this.state.wallFrequency,
            isSearching: this.state.isSearching
          }}
          callback={this.stateChange}
        />
        <h2>Stan: {this.state.message}</h2>
        <p>
          Wielkość siatki: {this.state.gridSize} x {this.state.gridSize}
        </p>
        <input
          type="range"
          defaultValue={this.state.gridSize}
          min="5"
          max="100"
          step="5"
          onInput={this.gridSizeChange}
        />
        <p>Częstość ścian: {this.state.wallFrequency}%</p>
        <input
          type="range"
          defaultValue={this.state.wallFrequency}
          min="0"
          max="100"
          step="1"
          onInput={this.wallFrequencyChange}
        />
        <br />
        <button onClick={this.toggleSearch} disabled={this.state.isDone}>
          {!this.state.isSearching ? "SZUKAJ" : "ZAKOŃCZ"}
        </button>
      </div>
    );
  }
}

export default App;
