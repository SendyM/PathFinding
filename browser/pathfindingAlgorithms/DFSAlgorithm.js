class DFSAlgorithm extends Algorithm {
  constructor() {
    super("Depth-first Search", "is <i><b>unweighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!");
  }

  run(nodes, start, target, nodesToAnimate, boardArray) {
    // basic argument validations
    if (!start || !target || start === target) {
      return false;
    }
    let nodeStack = [nodes[start]];
    let exploredNodes = { start: true };
    // depth-first algorithm - process nodes in the stack (last-in-first-out)
    while (nodeStack.length) {
      let currentNode = nodeStack.pop();
      nodesToAnimate.push(currentNode);
      exploredNodes[currentNode.id] = true
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
          nodes[neighbor].previousNode = currentNode.id;
          nodeStack.push(nodes[neighbor]);
        }
      });
    }
    return false;
  }

}
