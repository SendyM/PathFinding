class DFSAlgorithm extends Algorithm {
  constructor() {
    super("dfs", "Depth-first Search", "is <i><b>unweighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!");
  }

  run(nodes, start, target, nodesToAnimate, boardArray) {
    if (!start || !target || start === target) {
      return false;
    }
    let structure = [nodes[start]];
    let exploredNodes = { start: true };
    while (structure.length) {
      let currentNode = structure.pop();
      nodesToAnimate.push(currentNode);
      exploredNodes[currentNode.id] = true
      currentNode.status = "visited";
      if (currentNode.id === target) {
        return "success";
      }
      let currentNeighbors = this.getNeighbors(currentNode.id, nodes, boardArray);
      currentNeighbors.forEach(neighbor => {
        if (!exploredNodes[neighbor]) {
          nodes[neighbor].previousNode = currentNode.id;
          structure.push(nodes[neighbor]);
        }
      });
    }
    return false;
  }

}
