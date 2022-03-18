function animateSearch(board, success) {
  let nodes = board.nodesToAnimate.slice(0);
  let speed = board.speed === "five" ? 200 : 
  board.speed === "twentyfive" ? 100 : 
  board.speed === "fifty" ? 40 : 
  board.speed === "seventyfive" ? 10 :
  board.speed === "hundred" ? 0 :
  10;
  let shortestNodes;
  function timeout(index) {
    setTimeout(function () {
      if (index === nodes.length) {
        board.nodesToAnimate = [];
        if (success) {
          if (document.getElementById(board.target).className !== "visitedTargetNodeBlue") {
            document.getElementById(board.target).className = "visitedTargetNodeBlue";
          }
          board.drawShortestPathTimeout(board.target, board.start); // with animation
          // board.drawShortestPath(board.target, board.start); // without animation
          board.shortestPathNodesToAnimate = [];
          board.reset();
          shortestNodes = board.shortestPathNodesToAnimate;
          return;
        } else {
          console.warn("Failure.");
          board.reset();
          board.toggleButtons();
          return;
        }
      } else if (index === 0) {
        if (document.getElementById(board.start).className !== "visitedStartNodePurple") {
          document.getElementById(board.start).className = "visitedStartNodeBlue";
        }
        change(nodes[index])
      } else {
        change(nodes[index], nodes[index - 1]);
      }
      timeout(index + 1);
    }, speed);
  }

  function change(currentNode, previousNode) {
    let currentHTMLNode = document.getElementById(currentNode.id);
    let relevantClassNames = ["start", "target", "visitedStartNodeBlue", "visitedStartNodePurple", "visitedTargetNodePurple", "visitedTargetNodeBlue"];
    if (!relevantClassNames.includes(currentHTMLNode.className)) {
      currentHTMLNode.className = "current";
    }
    if (currentHTMLNode.className === "visitedStartNodePurple") {
      currentHTMLNode.className = "visitedStartNodeBlue";
    }
    if (previousNode) {
      let previousHTMLNode = document.getElementById(previousNode.id);
      if (!relevantClassNames.includes(previousHTMLNode.className)) {
        previousHTMLNode.className = previousNode.weight === 15 ? "visited weight" : "visited";
      }
    }
  }

  timeout(0);

};
