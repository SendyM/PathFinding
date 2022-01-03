class WeightedAlgorithm extends Algorithm {

  constructor(label, description) {
    super(label, description);
  }

  run(nodes, start, target, nodesToAnimate, boardArray) {
    // basic argument validations
    if (!start || !target || start === target) {
      return false;
    }
    nodes[start].distance = 0;
    nodes[start].direction = "right";
    let unvisitedNodes = Object.keys(nodes);
    while (unvisitedNodes.length) {
      let currentNode = this.closestNode(nodes, unvisitedNodes);
      while (currentNode.status === "wall" && unvisitedNodes.length) {
        currentNode = this.closestNode(nodes, unvisitedNodes)
      }
      if (currentNode.distance === Infinity) {
        return false;
      }
      nodesToAnimate.push(currentNode);
      currentNode.status = "visited";
      if (currentNode.id === target) {
        return true;
      }
      this.updateNeighbors(nodes, currentNode, boardArray, target, start);
    }
    return false;  // pre istotu
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

  updateNeighbors(nodes, node, boardArray, target, start) {
    let neighbors = this.getNeighbors(node.id, nodes, boardArray);
    for (let neighbor of neighbors) {
      this.updateNode(node, nodes[neighbor], nodes[target], name, nodes, nodes[start]);
    }
  }

  updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode) {
    let distance = this.getDistance(currentNode, targetNode);
    let distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
    if (distanceToCompare < targetNode.distance) {
      targetNode.distance = distanceToCompare;
      targetNode.previousNode = currentNode.id;
      targetNode.path = distance[1];
      targetNode.direction = distance[2];
    }
  }

  getDistance(nodeOne, nodeTwo) {
    let c1 = id2coordinates(nodeOne.id);
    let c2 = id2coordinates(nodeTwo.id);
    if (c2.x < c1.x) {
      if (nodeOne.direction === "up") {
        return [1, ["f"], "up"];
      } else if (nodeOne.direction === "right") {
        return [2, ["l", "f"], "up"];
      } else if (nodeOne.direction === "left") {
        return [2, ["r", "f"], "up"];
      } else if (nodeOne.direction === "down") {
        return [3, ["r", "r", "f"], "up"];
      }
    } else if (c2.x > c1.x) {
      if (nodeOne.direction === "up") {
        return [3, ["r", "r", "f"], "down"];
      } else if (nodeOne.direction === "right") {
        return [2, ["r", "f"], "down"];
      } else if (nodeOne.direction === "left") {
        return [2, ["l", "f"], "down"];
      } else if (nodeOne.direction === "down") {
        return [1, ["f"], "down"];
      }
    }
    if (c2.y < c1.y) {
      if (nodeOne.direction === "up") {
        return [2, ["l", "f"], "left"];
      } else if (nodeOne.direction === "right") {
        return [3, ["l", "l", "f"], "left"];
      } else if (nodeOne.direction === "left") {
        return [1, ["f"], "left"];
      } else if (nodeOne.direction === "down") {
        return [2, ["r", "f"], "left"];
      }
    } else if (c2.y > c1.y) {
      if (nodeOne.direction === "up") {
        return [2, ["r", "f"], "right"];
      } else if (nodeOne.direction === "right") {
        return [1, ["f"], "right"];
      } else if (nodeOne.direction === "left") {
        return [3, ["r", "r", "f"], "right"];
      } else if (nodeOne.direction === "down") {
        return [2, ["l", "f"], "right"];
      }
    }
  }

}
