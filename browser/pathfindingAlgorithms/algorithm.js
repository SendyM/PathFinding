class Algorithm {
  label = null
  description = null

  constructor(label, description) {
    this.label = label;
    this.description = description
  }

  /**
   * Spustenie algoritmu na vyhladanie cesty zo "start" do "target".
   * @param nodes Zoznam vrcholov, v ktorom sa hlada cesta.
   * @param start Zaciatocny vrchol
   * @param target Koncovy vrchol
   * @param nodesToAnimate Zoznam kde sa pridavaju vrcholy ktore treba animovat (teda cesta)
   * @param boardArray Bludisko (dvojrozmerna matica) v ktorom sa hlada cesta
   * @return true ak cesta bola najdena, inak false
   */
  run(nodes, start, target, nodesToAnimate, boardArray) {
    // toto treba implementovat v konkretnej triede
    throw new Error("Not implemented: run")
  }

  // prida do 'neighbors' node ak nie je stena
  addNeighbor(id, nodes, boardArray, neighbors, x, y) {
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
    this.addNeighbor(id, nodes, boardArray, neighbors, x - 1, y)
    this.addNeighbor(id, nodes, boardArray, neighbors, x, y - 1)
    this.addNeighbor(id, nodes, boardArray, neighbors, x + 1, y)
    this.addNeighbor(id, nodes, boardArray, neighbors, x, y + 1)
    return neighbors;
  }

  /**
   * Vzdialenost dvoch vrcholov v stvorcovej sieti
   * @param nodeOne Prvy vrchol
   * @param nodeDruhy Druhy vrchol
   * @return Vzdialenost - nezaporne cislo
   */
  static manhattanDistance(nodeOne, nodeTwo) {
    let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
    let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
    let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
    let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
    return (xChange + yChange);
  }

}
