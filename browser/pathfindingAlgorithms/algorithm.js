/** Abstraktna trieda - zaklad roznych implementacii algoritmov. */
class Algorithm {
  label = null;
  description = null;

  constructor(label, description) {
    this.label = label;
    this.description = description;
  }

  /**
   * Spustenie algoritmu na vyhladanie cesty zo "start" do "target".
   * @param nodes Zoznam vrcholov, v ktorom sa hlada cesta.
   * @param start Zaciatocny vrchol
   * @param target Koncovy vrchol
   * @param nodesToAnimate Zoznam kde sa pridavaju vrcholy ktore treba animovat
   * @return true ak cesta bola najdena, inak false
   */
  run(nodes, start, target, nodesToAnimate) {
    // toto treba implementovat v konkretnej triede
    throw new Error("Not implemented: " + this.run.name);
  }

  // prida do 'neighbors' node [x,y] ak existuje a nie je to stena
  addNeighbor(nodes, neighbors, x, y) {
    let id = coordinates2id(x, y)
    if (nodes[id] && nodes[id].status !== "wall") {
      neighbors.push(id);
    }
  }

  // vrati susedov pre node[id] ktori nie su steny; v poradi od "vlavo" v smere hodinovych ruciciek
  getNeighbors(id, nodes) {
    let neighbors = [];
    let node = nodes[id]
    this.addNeighbor(nodes, neighbors, node.x - 1, node.y)
    this.addNeighbor(nodes, neighbors, node.x, node.y - 1)
    this.addNeighbor(nodes, neighbors, node.x + 1, node.y)
    this.addNeighbor(nodes, neighbors, node.x, node.y + 1)
    return neighbors;
  }

}
