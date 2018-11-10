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
    let D2 = Math.sqrt(2); // 1 - Chebyshev distance, sqrt(2) - octile distance
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
    }

    // Wyświetl obecny stan siatki
    grid.displayNodes();

    // Szukaj rozwiązania - implementacja algorytmu A*
    if (isSearching && grid.openSet.length > 0) {
      p.customCallbackHandler({ message: "Szuka rozwiązania" });

      // Znajdz pole w zbiorze otwartym, które ma najleszą wartość funkcji F
      let bestFScoreIndex = 0;
      for (let i = 0; i < grid.openSet.length; i++) {
        if (grid.openSet[i].f < grid.openSet[bestFScoreIndex].f) {
          bestFScoreIndex = i;
        }
      }

      // Ustaw obence pole jako to, które ma najleszą wartość funkcji F
      let currentNode = grid.openSet[bestFScoreIndex];

      // Usuń obecne pole ze zbioru otwartego
      grid.openSet = grid.openSet.filter(
        (value, index) => index !== bestFScoreIndex
      );
      currentNode.isInOpenSet = false;

      // Dodaj obecne pole do zbioru zamkniętego
      grid.closedSet.push(currentNode);
      currentNode.isInClosedSet = true;

      // Zakończ działanie algorytu jeżeli obecne pole jest polem końcowym
      if (currentNode === grid.end) {
        // Przerwij szukanie
        isSearching = false;

        // Zbuduj optymalną scieżke rozwiązania
        let temporalNode = currentNode;
        grid.optimalPath.push(temporalNode);
        while (temporalNode.partent) {
          grid.optimalPath.push(temporalNode.partent);
          temporalNode = temporalNode.partent;
        }

        // Pokoloruj optymalną scieżke rozwiązania
        for (let i = 0; i < grid.optimalPath.length; i++) {
          grid.optimalPath[i].isOptimalPath = true;
        }

        // Przekaż informacje o wykonanym algorytmie do React
        p.customCallbackHandler({
          isSearching: isSearching,
          isDone: true,
          message: "Znaleziono rozwiązanie"
        });
      }

      // Utwórz kopię listy sąsiadów dla obecnego pola - dla czytelności rozwiązania
      let neighbors = currentNode.neighbors;

      // Sprawdź sąsiadów obecnego pola
      for (let i = 0; i < neighbors.length; i++) {
        // Sprawdż czy obecnie sprawdzany sąsiad nie należy do zbioru zamkniętego - jeżeli należy to zignoruj
        if (!grid.closedSet.includes(neighbors[i])) {
          // Oblicz wartość funkcji G (odległość) od startu do sprawdzanego sąsiada
          let temporaryGScore =
            currentNode.g + heuristic(neighbors[i], currentNode);
          let isPathBetter = false;
          // Sprawdż czy obecnie sprawdzany sąsiad jest już w zbiorze otwartym
          if (grid.openSet.includes(neighbors[i])) {
            // Jeżeli jest w zbiorze otwartym i wartość funkcji G dla tego pola jest większa od tymczasowej wartośći funkcji G
            // to ustaw wartość funkcji G dla tego pola na wartość tymszasową i uznaj że jest to lepsza ścieżka
            if (temporaryGScore < neighbors[i].g) {
              neighbors[i].g = temporaryGScore;
              isPathBetter = true;
            }
            // Jeżeli nie jest w zbiorze otwartym to go dodaj i przyporządkuj mu wartość G, jest to lepsza ścieżka
          } else {
            neighbors[i].g = temporaryGScore;
            isPathBetter = true;
            grid.openSet.push(neighbors[i]);
            neighbors[i].isInOpenSet = true;
          }
          // Jeżeli na tej podstawie odnalezione lepszą ścieżkę to oblicz heurystykę dla tego sąsiada i końca, oblicz wartość funkcji F
          // Przypisz do tego pola, pole poprzednie jako pole, w celu ustalenia najlepszej ścieżki
          if (isPathBetter) {
            neighbors[i].h = heuristic(neighbors[i], grid.end);
            neighbors[i].f = neighbors[i].g + neighbors[i].h;
            neighbors[i].partent = currentNode;
          }
        }
      }
      // Jeżeli nie ma już pól w zbiorze otwartym a nie dotarliśmy do końca, to zadanie nie ma roziązania
    } else if (isSearching && grid.openSet.length === 0) {
      // Przerwij szukanie
      isSearching = false;

      // Przekaż informacje o wykonanym algorytmie do React
      p.customCallbackHandler({
        isSearching: !isSearching,
        isDone: true,
        message: "Brak rozwiązania"
      });
    }
  };
}
