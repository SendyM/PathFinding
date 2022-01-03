class BFSAlgorithm extends Algorithm {
  constructor() {
    super("Breadth-first Search", "is <i><b>unweighted</b></i> and <i><b>guarantees</b></i> the shortest path!");
  }

  run(nodes, start, target, nodesToAnimate, boardArray) {
    // basic argument validations
    if (!start || !target || start === target) {
      return false;
    }
    let nodeQueue = [nodes[start]];
    let exploredNodes = { start: true };
    // depth-first algorithm - process nodes in the queue (first-in-first-out)
    while (nodeQueue.length) {
      let currentNode = nodeQueue.shift();
      nodesToAnimate.push(currentNode);
      currentNode.status = "visited";
      // are we already there?
      if (currentNode.id === target) {
        return true;
      }
      // still not found, add all valid neighbours to the queue
      let currentNeighbors = this.getNeighbors(currentNode.id, nodes, boardArray);
      currentNeighbors.forEach(neighbor => {
        // ignore nodes already processed
        if (!exploredNodes[neighbor]) {
          exploredNodes[neighbor] = true;
          nodes[neighbor].previousNode = currentNode.id;
          nodeQueue.push(nodes[neighbor]);
        }
      });
    }
    return false;
  }

}