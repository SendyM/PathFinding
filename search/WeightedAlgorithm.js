
/** Genericka (abstraktna) implementacia pathfinding algoritmu ktory respektuje vahy (weight). */
class WeightedAlgorithm extends Algorithm {

  constructor(label, description, w) {
    super(label, description);
    this.w = w;
  }

  runSpecific(nodes, start, target, nodesToAnimate) {
    // basic argument validations
    if (!nodes || !start || !target) {
      console.warn("Invalid arguments:", arguments)
      return false;
    }
    nodes[start].g = 0;
    nodes[start].f = 0;
    nodes[start].direction = "up";
    // unvisited node IDs (except for nodes with walls etc)
    let unvisitedNodes = Object.keys(nodes).filter(k => nodes[k].status !== "wall");
    while (unvisitedNodes.length) {
      // find unvisited node with minumal distance (i.e. closest)
      let currentNode = this.closestNode(nodes, unvisitedNodes);
      // A* ?
      while (currentNode.status === "wall" && unvisitedNodes.length) {
        currentNode = closestNode(nodes, unvisitedNodes)
      }
      if (!currentNode || currentNode.g === Infinity) {
        // closest not found or inaccessible, no path can be found
        return false;
      }
      nodesToAnimate.push(currentNode);
      currentNode.status = "visited";
      // are we there?
      if (currentNode.id === target) {
        return true;
      }
      // update neighbour nodes (possibly) with better distance
      let neighbors = this.getNeighbors(currentNode.id, nodes);
      for (let neighbor of neighbors) {
        this.updateNode(currentNode, nodes[neighbor], nodes[target]);
      }
    }
    return false;  // pre istotu
  }

  /** Return unvisited node with minimal "distance" attribute
   * @param nodes All nodes (array)
   * @param unvisitedNodes IDs of unvisited nodes.
   * @returns Unvisited node with minimal "distance" attribute
  */
  closestNode(nodes, unvisitedNodes) {
    let closest, closest_index;
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (!closest || closest.f > nodes[unvisitedNodes[i]].f) {
        closest = nodes[unvisitedNodes[i]];
        closest_index = i;
      }
    }
    unvisitedNodes.splice(closest_index, 1);
    console.log("closest=" + closest.id + ", f=" + closest.f + ", g:" + closest.g + ", h:" + closest.h)
    return closest;
  }

  /** Eventually update distance and other attributes of target node 
   * @param currentNode Current node 
   * @param targetNode Target (neighbor) node
   * @param actualTargetNode Global target node
   * @returns Nothing
  */
  updateNode(currentNode, targetNode, actualTargetNode) {
    let d = currentNode.g + currentNode.weight;
    if (d < targetNode.g) {
      targetNode.g = d;
      if (this.w && !targetNode.h) {
        targetNode.h = manhattanDistance(targetNode, actualTargetNode);
      }
      if (this.w == Infinity) {
        // Greedy
        targetNode.f = targetNode.h;
      } else if (this.w > 0) {
        // A* (Astar)
        targetNode.f = targetNode.g + this.w * targetNode.h;
      } else {
        // Dijkstra
        targetNode.f = targetNode.g;
      }
      targetNode.previousNode = currentNode.id;
      targetNode.direction = this.getDirection(currentNode, targetNode);
    }
  }

  /** Returns directon for moving from node1 to (neighbor) node2. 
   * @param node1 Starting node
   * @param node2 Target node
   * @returns Direction
  */
  getDirection(node1, node2) {
    if (node2.r < node1.r) {
      return "up";
    }
    if (node2.r > node1.r) {
      return "down";
    }
    if (node2.c < node1.c) {
      return "left";
    }
    if (node2.c > node1.c) {
      return "right";
    }
    return null; // just for case
  }

}
