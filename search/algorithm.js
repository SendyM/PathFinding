/** Abstraktna trieda - zaklad roznych implementacii algoritmov. */
class Algorithm {

  constructor(label, description) {
    this.label = label;
    this.description = description;
    this.stats = null;
  }

  /**
   * Spustenie algoritmu na vyhladanie cesty zo "start" do "target" s pocitanim statistik.
   * @param nodes Zoznam vrcholov, v ktorom sa hlada cesta.
   * @param start Zaciatocny vrchol
   * @param target Koncovy vrchol
   * @param nodesToAnimate Zoznam kde sa pridavaju vrcholy ktore treba animovat
   * @return true ak cesta bola najdena, inak false
   */
  run(nodes, start, target, nodesToAnimate) {
    this.stats = new AlgorithmStats(this.label);
    let success = this.runSpecific(nodes, start, target, nodesToAnimate);
    this.stats.finish(nodes, start, target, nodesToAnimate, success);
    return success;
  }

  // prida do 'neighbors' vrchol [r, c] ak taky existuje a nie je to stena
  addNeighbor(nodes, neighbors, r, c) {
    let id = coordinates2id(r, c);
    if (nodes[id] && nodes[id].status !== "wall") {
      neighbors.push(id);
    }
  }

  // vrati susedov pre node[id] ktori nie su steny; v poradi od "vlavo" v smere hodinovych ruciciek
  getNeighbors(id, nodes) {
    let neighbors = [];
    let node = nodes[id]
    this.addNeighbor(nodes, neighbors, node.r - 1, node.c)
    this.addNeighbor(nodes, neighbors, node.r, node.c - 1)
    this.addNeighbor(nodes, neighbors, node.r + 1, node.c)
    this.addNeighbor(nodes, neighbors, node.r, node.c + 1)
    return neighbors;
  }
}

/** Pomocna trieda pre pocitanie statistik algoritmu. */
class AlgorithmStats {

  // konstruktor (inicializacia statistik)
  constructor(name) {
    this.name = name;
    this.steps = 0;
    this.pathLength = 0;
    this.pathWeight = 0;
    this.startTime = Date.now();
    this.endTime = null;
    this.success = false;
  }

  // ukonci pocitanie statistiky a zaloguje vysledok
  finish(nodes, startNodeId, targetNodeId, nodesToAnimate, success) {
    this.endTime = Date.now();
    this.success = success;
    if (success) {
      let currentNode = nodes[targetNodeId];
      while (currentNode.id !== startNodeId) {
        currentNode = nodes[currentNode.previousNode];
        this.pathLength += 1;
        this.pathWeight += currentNode.weight;
      }
      this.steps = nodesToAnimate.length;
    }
    console.info(this, "miliseconds:", this.endTime - this.startTime)
    
    //console.log(column)
    // pridaj novu statistiku
    let myStats = document.getElementById('statsText');
    myStats.innerHTML += "<tr><td>" + this.name
      + "</td><td>" + this.steps
      + "</td><td>" + this.pathLength
      + "</td><td>" + this.pathWeight
      + "</td><td>" + (this.endTime - this.startTime)
      + "</td></td>";
    document.getElementById("clearStats").onclick = () => {
      myStats.innerHTML = "";
      column = 0;
    }
  }

}