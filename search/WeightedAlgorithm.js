
/** Genericka (abstraktna) implementacia pathfinding algoritmu ktory respektuje vahy (weight). */
class WeightedAlgorithm extends Algorithm {

  // Konstanty pre ceny za otocenie (smerove vahy)
  DIS_STRIGHT = 1; // rovno
  DIS_TURN = 1; // vlavo/vpravo
  DIS_REV = 1; // celom vzad

  constructor(label, description, w) {
    super(label, description);
  }

  runSpecific(nodes, start, target, nodesToAnimate) {
    // basic argument validations
    if (!nodes || !start || !target) {
      console.warn("Invalid arguments:", arguments)
      return false;
    }
    nodes[start].distance = 0;
    nodes[start].totalDistance = 0;
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
      if (!currentNode || currentNode.distance === Infinity) {
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
    throw new Error("Abstract method called");
  }

  /** Eventually update distance and other attributes of target node 
   * @param currentNode Current node 
   * @param targetNode Target (neighbor) node
   * @param actualTargetNode Global target node
   * @returns Nothing
  */
  updateNode(currentNode, targetNode, actualTargetNode) {
    throw new Error("Abstract method called");
  }

  /** Returns distance, path and directon for moving from node1 to (neighbor) node2. 
   * Distance is 1 (stright direction, cheapest = preferred), 2 (turn left or right) or 3 (reverse direction).
   * Path is sequence of directions, and direction is "up", "down", "left" or "right".
   * @param node1 Starting node
   * @param node2 Target node
   * @returns List: [distance, path, direction]
  */
  getDistance(node1, node2) {
    if (node2.r < node1.r) { // this is node "above" node1
      return {
        "up": [this.DIS_STRIGHT, ["f"], "up"],
        "right": [this.DIS_TURN, ["l", "f"], "up"],
        "left": [this.DIS_TURN, ["r", "f"], "up"],
        "down": [this.DIS_REV, ["r", "r", "f"], "up"],
      }[node1.direction];
    }
    if (node2.r > node1.r) { // this is node "below" node1
      return {
        "up": [this.DIS_REV, ["r", "r", "f"], "down"],
        "right": [this.DIS_TURN, ["r", "f"], "down"],
        "left": [this.DIS_TURN, ["l", "f"], "down"],
        "down": [this.DIS_STRIGHT, ["f"], "down"],
      }[node1.direction];
    }
    if (node2.c < node1.c) { // this is node "left" of node1
      return {
        "up": [this.DIS_TURN, ["l", "f"], "left"],
        "right": [this.DIS_REV, ["l", "l", "f"], "left"],
        "left": [this.DIS_STRIGHT, ["f"], "left"],
        "down": [this.DIS_TURN, ["r", "f"], "left"],
      }[node1.direction];
    }
    if (node2.c > node1.c) { // this is node "right" of node1
      return {
        "up": [this.DIS_TURN, ["r", "f"], "right"],
        "right": [this.DIS_STRIGHT, ["f"], "right"],
        "left": [this.DIS_REV, ["r", "r", "f"], "right"],
        "down": [this.DIS_TURN, ["l", "f"], "right"],
      }[node1.direction];
    }
    return null; // just for case
  }

}
