class DijkstraAlgorithm extends WeightedAlgorithm {

  constructor() {
    super("Dijkstra's Algorithmus", "je <i><b>váhovaný</b></i> a <i><b>garantuje</b></i> najkratšiu cestu!")
  }

  closestNode(nodes, unvisitedNodes) {
    let currentClosest, index;
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (!currentClosest || currentClosest.distance > nodes[unvisitedNodes[i]].distance) {
        currentClosest = nodes[unvisitedNodes[i]];
        index = i;
      }
    }
    unvisitedNodes.splice(index, 1);
    return currentClosest;
  }

  updateNode(currentNode, targetNode, actualTargetNode) {
    let distance = this.getDistance(currentNode, targetNode);
    let distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
    if (distanceToCompare < targetNode.distance) {
      targetNode.distance = distanceToCompare;
      targetNode.previousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.direction = distance[2];
    }
  }

}
