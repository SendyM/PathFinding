class BFSAlgorithm extends Algorithm {
  constructor() {
    super("Breadth-first Search", "is <i><b>unweighted</b></i> and <i><b>guarantees</b></i> the shortest path!");
  }

  run(nodes, start, target, nodesToAnimate, boardArray) {
    if (!start || !target || start === target) {
      return false;
    }
    let structure = [nodes[start]];
    let exploredNodes = { start: true };
    while (structure.length) {
      let currentNode = structure.shift();
      nodesToAnimate.push(currentNode);
      currentNode.status = "visited";
      if (currentNode.id === target) {
        return "success";
      }
      let currentNeighbors = this.getNeighbors(currentNode.id, nodes, boardArray);
      currentNeighbors.forEach(neighbor => {
        if (!exploredNodes[neighbor]) {
          exploredNodes[neighbor] = true;
          nodes[neighbor].previousNode = currentNode.id;
          structure.push(nodes[neighbor]);
        }
      });
    }
    return false;
  }

}