function weightsDemonstration(board) {
  let currentIdX = board.height - 1;
  let currentIdY = 35;
  while (currentIdX > 5) {
    let currentId = coordinates2id(currentIdX, currentIdY);
    let currentElement = document.getElementById(currentId);
    board.wallsToAnimate.push(currentElement);
    let currentNode = board.nodes[currentId];
    currentNode.status = "wall";
    currentNode.weight = WEIGHT_WALL;
    currentIdX--;
  }
  for (let currentIdX = board.height - 2; currentIdX > board.height - 11; currentIdX--) {
    for (let currentIdY = 1; currentIdY < 35; currentIdY++) {
      let currentId = coordinates2id(currentIdX, currentIdY);
      let currentElement = document.getElementById(currentId);
      board.wallsToAnimate.push(currentElement);
      let currentNode = board.nodes[currentId];
      if (currentIdX === board.height - 2 && currentIdY < 35 && currentIdY > 26) {
        currentNode.status = "wall";
        currentNode.weight = WEIGHT_WALL;
      } else {
        currentNode.status = "unvisited";
        currentNode.weight = WEIGHT_DEFAULT;
      }
    }
  }
}


