class DijkstraAlgorithm extends WeightedAlgorithm {

  constructor() {
    super("Dijkstra", "je <i><b>váhovaný</b></i> a <i><b>garantuje</b></i> najkratšiu cestu!", 0)
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
    let d = currentNode.distance + targetNode.weight + distance[0];
    if (d < targetNode.distance) {
      targetNode.distance = d;
      targetNode.previousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.direction = distance[2];
    }
  }

}
