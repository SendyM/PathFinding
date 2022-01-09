class BoardNode {
  constructor(id, status) {
    this.id = id;
    // koli optimalizacii si rovno vypocitame koordinaty...
    let coordinates = id.split("-");
    this.x = parseInt(coordinates[0]);
    this.y = parseInt(coordinates[1]);
    // ... a nastavime defaultove hodnoty
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
   * Skonvertuje (ciselne) koordinaty x,y vrcholu na id-cko (v tvare "x-y")
   * @param x X-ova suradnica vrcholu
   * @param y Y-ova suradnica vrcholu
   * @returns ID-cko vrcholu
   */
function coordinates2id(x, y) {
  return `${x}-${y}`
}

/**
   * Vzdialenost dvoch vrcholov v stvorcovej sieti
   * @param node1 Prvy vrchol
   * @param node2 Druhy vrchol
   * @return Vzdialenost - nezaporne cislo
   */
function manhattanDistance(node1, node2) {
  return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
}
