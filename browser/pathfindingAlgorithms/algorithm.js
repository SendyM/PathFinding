class Algorithm {
  algoName = '(unknown)'
  label = '???'

  constructor(algoName, label) {
    this.algoName = algoName;
    this.label = label;
  }

  run(nodes, start, target, nodesToAnimate, boardArray) {
    // toto treba implmentovat v konkretnej triede
    throw new Error("Not implemented")
  }

  manhattanDistance(nodeOne, nodeTwo) {
    let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
    let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
    let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
    let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
    return (xChange + yChange);
  }

  isWeighted() {
    return true;
  }

  getDescription() {
    return null;
  }

}
