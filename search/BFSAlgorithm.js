/** Konkretna implementacia algoritmu - prehladavanie do sirky (BFS=breadth-first search). */
class BFSAlgorithm extends Algorithm {

  constructor() {
    super("Breadth-first", "je <i><b>neváhovaný</b></i> a <i><b>garantuje</b></i> najkratšiu cestu!");
  }

  runSpecific(nodes, start, target, nodesToAnimate) {
    // basic argument validations
    if (!nodes || !start || !target) {
      console.warn("Invalid arguments:", arguments)
      return false;
    }
    let nodeQueue = [nodes[start]];
    let exploredNodes = { start: true };
    // breadth-first algorithm - process nodes in the queue (first-in-first-out)
    while (nodeQueue.length) {
      let currentNode = nodeQueue.shift();
      nodesToAnimate.push(currentNode);
      currentNode.status = "visited";
      // are we already there?
      if (currentNode.id === target) {
        return true;
      }
      // still not found, add all valid neighbours to the queue
      let currentNeighbors = this.getNeighbors(currentNode.id, nodes);
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