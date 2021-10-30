class Algorithm {
  algoName = null
  label = null
  description = null

  constructor(algoName, label, description) {
    this.algoName = algoName;
    this.label = label;
    this.description = description
  }

  run(nodes, start, target, nodesToAnimate, boardArray) {
    // toto treba implementovat v konkretnej triede
    throw new Error("Not implemented: run")
  }

  // prida do 'neighbors' node ak nie je stena
  getNeighbor(id, nodes, boardArray, neighbors, x, y) {
    if (boardArray[x] && boardArray[x][y]) {
      let potentialNeighbor = `${x}-${y}`
      if (nodes[potentialNeighbor].status !== "wall") {
        neighbors.push(potentialNeighbor);
      }
    }
  }

  // vrati susedov ktori nie su steny; v poradi od vlavo v smere hodinovych ruciciek
  getNeighbors(id, nodes, boardArray) {
    let coordinates = id.split("-");
    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);
    let neighbors = [];
    this.getNeighbor(id, nodes, boardArray, neighbors, x - 1, y)
    this.getNeighbor(id, nodes, boardArray, neighbors, x, y - 1)
    this.getNeighbor(id, nodes, boardArray, neighbors, x + 1, y)
    this.getNeighbor(id, nodes, boardArray, neighbors, x, y + 1)
    return neighbors;
  }

  // vzdialenost dvoch nodov v stvorcovej sieti
  manhattanDistance(nodeOne, nodeTwo) {
    let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
    let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
    let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
    let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
    return (xChange + yChange);
  }

}
