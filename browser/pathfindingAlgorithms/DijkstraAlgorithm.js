class DijkstraAlgorithm extends WeightedAlgorithm {

  constructor() {
    super("dijkstra", "Dijkstra's Algorithm");
  }

  getDescription() {
    return `${this.label} is <i><b>weighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
  }

}
