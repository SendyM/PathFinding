var SPEED_MAP = {
  "five": 16,
  "twentyfive": 8,
  "fifty": 4,
  "seventyfive": 2,
  "hundred": 1,
}

function animateMaze(board) {
  let nodes = board.wallsToAnimate.slice(0);
  let speed = SPEED_MAP[board.speed];
  function timeout(index) {
    setTimeout(function () {
        if (index === nodes.length){
          board.wallsToAnimate = [];
          board.toggleButtons();
          return;
        }
        nodes[index].className = "wall";
        timeout(index + 1);
    }, speed);
  }

  timeout(0);
};


