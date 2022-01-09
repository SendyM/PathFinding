class AstarAlgorithm extends WeightedAlgorithm {

  constructor() {
    super("A* Algorithm", "is <i><b>weighted</b></i> and <i><b>guarantees</b></i> the shortest path!");
  }

  run(nodes, start, target, nodesToAnimate) {
    nodes[start].totalDistance = 0;
    return super.run(nodes, start, target, nodesToAnimate)
  }

  closestNode(nodes, unvisitedNodes) {
    let currentClosest, index;
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (!currentClosest || currentClosest.totalDistance > nodes[unvisitedNodes[i]].totalDistance) {
        currentClosest = nodes[unvisitedNodes[i]];
        index = i;
      } else if (currentClosest.totalDistance === nodes[unvisitedNodes[i]].totalDistance) {
        if (currentClosest.heuristicDistance > nodes[unvisitedNodes[i]].heuristicDistance) {
          currentClosest = nodes[unvisitedNodes[i]];
          index = i;
        }
      }
    }
    unvisitedNodes.splice(index, 1);
    return currentClosest;
  }

  updateNode(currentNode, targetNode, actualTargetNode) {
    let distance = this.getDistance(currentNode, targetNode);
    if (!targetNode.heuristicDistance) targetNode.heuristicDistance = manhattanDistance(targetNode, actualTargetNode);
    let distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
    if (distanceToCompare < targetNode.distance) {
      targetNode.distance = distanceToCompare;
      targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
      targetNode.previousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.direction = distance[2];
    }
  }

}

