// vahy (ceny) za prechod do vrcholu:
var WEIGHT_WALL = Infinity;  // nepriechodny vrchol = stena
var WEIGHT_MID = 5;  // stredna vaha (cena)
var WEIGHT_DEFAULT = 1;  // zakladna vaha (cena)

/** Board node. */
class BoardNode {
  constructor(id, status) {
    this.id = id;
    // koli optimalizacii si rovno vypocitame koordinaty...
    let coordinates = id.split("-");
    this.r = parseInt(coordinates[0]); // row
    this.c = parseInt(coordinates[1]); // column
    // ... a nastavime defaultove hodnoty
    this.reset(status, WEIGHT_DEFAULT)
  }

  reset(status, weight) {
    this.status = status;
    this.previousNode = null;
    this.direction = null;
    this.f = Infinity;
    this.g = Infinity;
    this.h = 0;
    this.weight = weight;
  }
}

/**
   * Skonvertuje (ciselne) koordinaty r,c vrcholu na id-cko (v tvare "x-y").
   * @param r Row (y-coordinate)
   * @param c Column (x-coordinate)
   * @returns ID-cko vrcholu
   */
function coordinates2id(r, c) {
  return `${r}-${c}`
}

/**
   * Vzdialenost dvoch vrcholov v stvorcovej sieti.
   * @param node1 Prvy vrchol
   * @param node2 Druhy vrchol
   * @return Vzdialenost = sucet vzdialenosti v x-ovej a y-ovej osi (nezaporne cislo)
   */
function manhattanDistance(node1, node2) {
  return Math.abs(node1.c - node2.c) + Math.abs(node1.r - node2.r);
}
