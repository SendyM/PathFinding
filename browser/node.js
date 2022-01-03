class BoardNode {
  constructor(id, status) {
    this.id = id;
    this.reset(status)
  }

  reset(status) {
    this.status = status;
    this.previousNode = null;
    this.path = null;
    this.direction = null;
    this.distance = Infinity;
    this.totalDistance = Infinity;
    this.heuristicDistance = null;
    this.weight = 0;
  }
}

/**
   * Skonvertuje id-cko (v tvare "x-y") na cielne koordinaty (objekt s ciselnymi properties x a y)
   */
function id2coordinates(id) {
  let coordinates = id.split("-");
  return { x: parseInt(coordinates[0]), y: parseInt(coordinates[1]) }
}

/**
   * Skonvertuje (ciselne) koordinaty x,y na id-cko (v tvare "x-y")
   */
function coordinates2id(x, y) {
  return `${x}-${y}`
}

/**
   * Vzdialenost dvoch vrcholov v stvorcovej sieti
   * @param nodeOne Prvy vrchol
   * @param nodeDruhy Druhy vrchol
   * @return Vzdialenost - nezaporne cislo
   */
function manhattanDistance(nodeOne, nodeTwo) {
  let nodeOneCoords = id2coordinates(nodeOne.id);
  let nodeTwoCoords = id2coordinates(nodeTwo.id);
  return Math.abs(nodeOneCoords.x - nodeTwoCoords.x) + Math.abs(nodeOneCoords.y - nodeTwoCoords.y);
}
