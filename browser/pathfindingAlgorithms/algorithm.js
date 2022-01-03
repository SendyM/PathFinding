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
   * @param nodesToAnimate Zoznam kde sa pridavaju vrcholy ktore treba animovat
   * @param boardArray Bludisko (dvojrozmerna matica) v ktorom sa hlada cesta
   * @return true ak cesta bola najdena, inak false
   */
  run(nodes, start, target, nodesToAnimate, boardArray) {
    // toto treba implementovat v konkretnej triede
    throw new Error("Not implemented: run")
  }

  // prida do 'neighbors' node [x,y] ak existuje a nie je to stena
  addNeighbor(nodes, boardArray, neighbors, x, y) {
    if (boardArray[x] && boardArray[x][y]) {
      let id = coordinates2id(x, y)
      if (nodes[id].status !== "wall") {
        neighbors.push(id);
      }
    }
  }

  // vrati susedov pre node[id] ktori nie su steny; v poradi od vlavo v smere hodinovych ruciciek
  getNeighbors(id, nodes, boardArray) {
    let neighbors = [];
    let c = id2coordinates(id)
    this.addNeighbor(nodes, boardArray, neighbors, c.x - 1, c.y)
    this.addNeighbor(nodes, boardArray, neighbors, c.x, c.y - 1)
    this.addNeighbor(nodes, boardArray, neighbors, c.x + 1, c.y)
    this.addNeighbor(nodes, boardArray, neighbors, c.x, c.y + 1)
    return neighbors;
  }
  
}
