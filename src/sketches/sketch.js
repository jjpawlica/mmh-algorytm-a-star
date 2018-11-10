export default function sketch(p) {
  // Wielkość okna
  let windowSize = 600;

  // Kontrola algorytmu
  let isSearching = false;

  // Ustawienia siatki
  let defaultGridSize = 20;
  let currnetGridSize = defaultGridSize;
  let newGridSize = 0;

  // Ustawienia przeszkód
  let defaultWallFrequency = 0.2;
  let currentWallFrequency = defaultWallFrequency;
  let newWallFrequency = 0;

  // Wielkość pola
  let squareSize = windowSize / currnetGridSize;

  // Definicja siatki
  class Grid {
    constructor(gridSize, squareSize, wallFrequency) {
      this.gridSize = gridSize;
      this.squareSize = squareSize;
      this.wallFrequency = wallFrequency;
      this.grid = new Array(gridSize);
    }

    // Utwórz stosowną strukturę siatki
    createNodes = () => {
      for (let x = 0; x < this.gridSize; x++) {
        this.grid[x] = new Array(this.gridSize);
      }

      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          this.grid[x][y] = new Node(x, y, this.squareSize, this.wallFrequency);
        }
      }

      this.start = this.grid[0][0];
      this.end = this.grid[this.gridSize - 1][this.gridSize - 1];

      this.start.wall = 0;
      this.end.wall = 0;
    };

    // Pokaż każde pole
    displayNodes = () => {
      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          this.grid[x][y].showNode();
        }
      }
    };
  }

  // Definicja pola
  class Node {
    constructor(x, y, squareSize, wallFrequency) {
      // Wielkość pola
      this.size = squareSize;

      // Pozycja pola w przestrzeni
      this.x = x;
      this.y = y;

      // Czy pole jest przeszkodą
      this.wall = false;

      // Dodaj losowo przeszkodę
      if (Math.random() < wallFrequency) {
        this.wall = true;
      }
    }

    // Wyświetl pole
    showNode = () => {
      p.noStroke();
      p.fill(255);

      if (this.wall) {
        p.fill(36);
      }

      p.rect(
        this.x * this.size,
        this.y * this.size,
        this.size - 1,
        this.size - 1
      );
    };
  }

  // Utwórz nową siatkę
  let grid = new Grid(currnetGridSize, squareSize, currentWallFrequency);

  p.setup = function() {
    p.createCanvas(windowSize, windowSize);
    grid.createNodes();
  };

  p.customRedrawHandler = function(values) {
    newGridSize = values.gridSize;
    newWallFrequency = values.wallFrequency / 100;
  };

  p.draw = function() {
    p.background(255);

    // Wyświetl obecny stan siatki
    grid.displayNodes();

    // Szukaj rozwiązania - implementacja algorytmu A*
    if (isSearching) {
    }
  };
}
