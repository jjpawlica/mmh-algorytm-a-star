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

      // Listy pół potrzebne do działania algorytmu
      this.openSet = [];
      this.closedSet = [];
      this.optimalPath = [];
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

    // Dla każdego pola ustal sąsiadów
    setNodesNeighbors = () => {
      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          if (!this.grid[x][y].wall) {
            for (
              let i = Math.max(0, x - 1);
              i <= Math.min(x + 1, this.gridSize - 1);
              i++
            ) {
              for (
                let j = Math.max(0, y - 1);
                j <= Math.min(y + 1, this.gridSize - 1);
                j++
              ) {
                if (i !== x || j !== y) {
                  if (!this.grid[i][j].wall) {
                    this.grid[x][y].neighbors.push(this.grid[i][j]);
                  }
                }
              }
            }
          }
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

      // Wartości funckji dla algorytmu
      this.f = 0;
      this.g = 0;
      this.h = 0;

      // Sąsiedzi danego pola
      this.neighbors = [];

      // Poprzednie pole
      this.partent = undefined;

      // Do jakiego zbioru należy dane pole
      this.isInOpenSet = false;
      this.isInClosedSet = false;
      this.isOptimalPath = false;
    }

    // Wyświetl pole
    showNode = () => {
      p.noStroke();
      p.fill(255);

      if (this.wall) {
        p.fill(36);
      }

      if (this.isInOpenSet) {
        p.fill(p.color(0, 255, 0, 80));
      }

      if (this.isInClosedSet) {
        p.fill(p.color(255, 0, 0, 80));
      }

      if (this.isOptimalPath) {
        p.fill(p.color(0, 0, 255, 80));
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

  // Funcka zwracająca wartość heurystyki dla siatki, gdzie można poruszać się po przekątnych
  let heuristic = (a, b) => {
    let D1 = 1;
    let D2 = 1; // 1 - Chebyshev distance, sqrt(2) - octile distance
    let dx = p.abs(a.x - b.x);
    let dy = p.abs(a.y - b.y);
    return D1 * (dx + dy) + (D2 - 2 * D1) * Math.min(dx, dy);
  };

  p.setup = function() {
    p.createCanvas(windowSize, windowSize);
    grid.createNodes();
    grid.setNodesNeighbors();
    grid.openSet.push(grid.start);
    grid.start.isInOpenSet = true;
    console.log("SETUP");
    console.log(grid);
    console.log(grid.openSet.length);
  };

  p.customRedrawHandler = function(values) {
    newGridSize = values.gridSize;
    newWallFrequency = values.wallFrequency / 100;
    isSearching = values.isSearching;
  };

  p.draw = function() {
    p.background(255);

    // Utwórz nową siatkę jak zostanie zmieniony rozmiar
    if (newGridSize !== currnetGridSize) {
      squareSize = windowSize / newGridSize;
      currnetGridSize = newGridSize;
      grid = new Grid(currnetGridSize, squareSize, currentWallFrequency);
      grid.createNodes();
      grid.setNodesNeighbors();
      grid.openSet.push(grid.start);
      grid.start.isInOpenSet = true;
      p.customCallbackHandler({ isDone: false });
      console.log("AKTUALIZACJA WIELKOSC");
      console.log(grid);
      console.log(grid.openSet.length);
    }

    // Utwórz nową siatkę jak zostanie zmieniona częstość występowania ścian
    if (newWallFrequency !== currentWallFrequency) {
      currentWallFrequency = newWallFrequency;
      grid = new Grid(currnetGridSize, squareSize, currentWallFrequency);
      grid.createNodes();
      grid.setNodesNeighbors();
      grid.openSet.push(grid.start);
      grid.start.isInOpenSet = true;
      p.customCallbackHandler({ isDone: false });
      console.log("AKTUALIZACJA SCIANY");
      console.log(grid);
      console.log(grid.openSet.length);
    }

    // Wyświetl obecny stan siatki
    grid.displayNodes();

    // Szukaj rozwiązania - implementacja algorytmu A*
    if (isSearching) {
    }
  };
}
