class AstarAlgorithm extends WeightedAlgorithm {

  constructor() {
    super("A*", "je <i><b>váhovaný</b></i> a <i><b>garantuje</b></i> najkratšiu cestu!", 1);
  }

  closestNode(nodes, unvisitedNodes) {
    let closest, index;
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (!closest || closest.totalDistance > nodes[unvisitedNodes[i]].totalDistance) {
        closest = nodes[unvisitedNodes[i]];
        index = i;
      } else if (closest.totalDistance === nodes[unvisitedNodes[i]].totalDistance) {
        if (closest.heuristicDistance > nodes[unvisitedNodes[i]].heuristicDistance) {
          closest = nodes[unvisitedNodes[i]];
          index = i;
        }
      }
    }
    unvisitedNodes.splice(index, 1);
    console.log("closest:" + closest.id + ", d:" + closest.distance + ", t:" + closest.totalDistance + ", h:" + closest.heuristicDistance )
    return closest;
  }

  updateNode(currentNode, targetNode, actualTargetNode) {
    let distance = this.getDistance(currentNode, targetNode);
    if (!targetNode.heuristicDistance) {
      targetNode.heuristicDistance = manhattanDistance(targetNode, actualTargetNode);
    }
    //let d = currentNode.distance + targetNode.weight + distance[0];
    let d = currentNode.distance + distance[0];
    if (d < targetNode.distance) {
      targetNode.distance = d;
      targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
      targetNode.previousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.direction = distance[2];
    }
  }

}
