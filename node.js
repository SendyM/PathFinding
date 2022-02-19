class BoardNode {
  constructor(id, status) {
    this.id = id;
    // koli optimalizacii si rovno vypocitame koordinaty...
    let coordinates = id.split("-");
    this.r = parseInt(coordinates[0]); // row
    this.c = parseInt(coordinates[1]); // column
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
   * Skonvertuje (ciselne) koordinaty r,c vrcholu na id-cko (v tvare "x-y")
   * @param r Row (y-coordinate)
   * @param c Column (x-coordinate)
   * @returns ID-cko vrcholu
   */
function coordinates2id(r, c) {
  return `${r}-${c}`
}

/**
   * Vzdialenost dvoch vrcholov v stvorcovej sieti
   * @param node1 Prvy vrchol
   * @param node2 Druhy vrchol
   * @return Vzdialenost - nezaporne cislo
   */
function manhattanDistance(node1, node2) {
  return Math.abs(node1.c - node2.c) + Math.abs(node1.r - node2.r);
}
