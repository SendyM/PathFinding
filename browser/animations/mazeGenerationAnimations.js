function mazeGenerationAnimations(board) {
  let nodes = board.wallsToAnimate.slice(0);
  let speed = board.speed === "five" ? 150 : 
  board.speed === "twentyfive" ? 100 : 
  board.speed === "fifty" ? 50 : 
  board.speed === "seventyfive" ? 15 :
  board.speed === "hundred" ? 3 :
  15;
  function timeout(index) {
    setTimeout(function () {
        if (index === nodes.length){
          board.wallsToAnimate = [];
          board.toggleButtons();
          return;
        }
        nodes[index].className = board.nodes[nodes[index].id].weight === 15 ? "unvisited weight" : "wall";
        timeout(index + 1);
    }, speed);
  }

  timeout(0);
};


