class GreedyAlgorithm extends WeightedAlgorithm {

  constructor() {
    super("greedy", "Greedy Best-first Search");
  }

  updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
    let distance = getDistance(currentNode, targetNode);
    let distanceToCompare = targetNode.weight + distance[0] + this.manhattanDistance(targetNode, actualTargetNode);
    if (distanceToCompare < targetNode.distance) {
      targetNode.distance = distanceToCompare;
      targetNode.previousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.direction = distance[2];
    }
  } 

  getDescription() {
    return `${this.label} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`; 
  }

}
