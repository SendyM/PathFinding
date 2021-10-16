class WeightedAlgorithm extends Algorithm {
  constructor(algoName, label) {
    super(algoName, label);
  }

  run(nodes, start, target, nodesToAnimate, boardArray) {
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
        return "success!";
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

  getNeighbors(id, nodes, boardArray) {
    let coordinates = id.split("-");
    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);
    let neighbors = [];
    let potentialNeighbor;
    if (boardArray[x - 1] && boardArray[x - 1][y]) {
      potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    if (boardArray[x + 1] && boardArray[x + 1][y]) {
      potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    if (boardArray[x][y - 1]) {
      potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    if (boardArray[x][y + 1]) {
      potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    return neighbors;
  }

  getDistance(nodeOne, nodeTwo) {
    let currentCoordinates = nodeOne.id.split("-");
    let targetCoordinates = nodeTwo.id.split("-");
    let x1 = parseInt(currentCoordinates[0]);
    let y1 = parseInt(currentCoordinates[1]);
    let x2 = parseInt(targetCoordinates[0]);
    let y2 = parseInt(targetCoordinates[1]);
    if (x2 < x1) {
      if (nodeOne.direction === "up") {
        return [1, ["f"], "up"];
      } else if (nodeOne.direction === "right") {
        return [2, ["l", "f"], "up"];
      } else if (nodeOne.direction === "left") {
        return [2, ["r", "f"], "up"];
      } else if (nodeOne.direction === "down") {
        return [3, ["r", "r", "f"], "up"];
      }
    } else if (x2 > x1) {
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
    if (y2 < y1) {
      if (nodeOne.direction === "up") {
        return [2, ["l", "f"], "left"];
      } else if (nodeOne.direction === "right") {
        return [3, ["l", "l", "f"], "left"];
      } else if (nodeOne.direction === "left") {
        return [1, ["f"], "left"];
      } else if (nodeOne.direction === "down") {
        return [2, ["r", "f"], "left"];
      }
    } else if (y2 > y1) {
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


