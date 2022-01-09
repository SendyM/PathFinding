/** Genericka (abstraktna) implementacia pathfinding algoritmu ktory respektuje vahy (weight). */
class WeightedAlgorithm extends Algorithm {

  constructor(label, description) {
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
    nodes[start].direction = "right";
    // unvisited node IDs (except for nodes with walls etc)
    let unvisitedNodes = Object.keys(nodes).filter(k => nodes[k].status !== "wall");
    while (unvisitedNodes.length) {
      // find unvisited node with minumal distance (i.e. closest)
      let currentNode = this.closestNode(nodes, unvisitedNodes);
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
   * @param node1 Node1 (starting node)
   * @param node2 Node2 (target node)
   * @returns Distance (first element), path (second element) and arrow direction (third element)
  */
  getDistance(node1, node2) {
    if (node2.r < node1.r) { // this is node "above" node1
      return {
        "up": [1, ["f"], "up"],
        "right": [2, ["l", "f"], "up"],
        "left": [2, ["r", "f"], "up"],
        "down": [3, ["r", "r", "f"], "up"],
      }[node1.direction];
    }
    if (node2.r > node1.r) { // this is node "below" node1
      return {
        "up": [3, ["r", "r", "f"], "down"],
        "right": [2, ["r", "f"], "down"],
        "left": [2, ["l", "f"], "down"],
        "down": [1, ["f"], "down"],
      }[node1.direction];
    }
    if (node2.c < node1.c) { // this is node "left" of node1
      return {
        "up": [2, ["l", "f"], "left"],
        "right": [3, ["l", "l", "f"], "left"],
        "left": [1, ["f"], "left"],
        "down": [2, ["r", "f"], "left"],
      }[node1.direction];
    }
    if (node2.c > node1.c) { // this is node "right" of node1
      return {
        "up": [2, ["r", "f"], "right"],
        "right": [1, ["f"], "right"],
        "left": [3, ["r", "r", "f"], "right"],
        "down": [2, ["l", "f"], "right"],
      }[node1.direction];
    }
    return null; // just for case
  }

}
