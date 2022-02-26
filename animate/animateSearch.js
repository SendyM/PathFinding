var SPEED_MAP = {
  "five": 200,
  "twentyfive": 100,
  "fifty": 50,
  "seventyfive": 15,
  "hundred": 3,
}

function animateSearch(board, success) {
  let nodes = board.nodesToAnimate.slice(0);
  let speed = SPEED_MAP[board.speed];
  let shortestNodes;
  function timeout(index) {
    setTimeout(function () {
      if (index === nodes.length) {
        board.nodesToAnimate = [];
        if (success) {
          if (document.getElementById(board.target).className !== "visitedTargetNodeBlue") {
            document.getElementById(board.target).className = "visitedTargetNodeBlue";
          }
          drawShortestPathTimeout(board); // with animation
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

/** Vykreslenie najdenej cesty s animaciou. */
function drawShortestPathTimeout(board) {
  let currentNode;
  let secondCurrentNode;
  let currentNodesToAnimate;

  currentNode = board.nodes[board.nodes[board.target].previousNode];
  currentNodesToAnimate = [];
  while (currentNode.id !== board.start) {
    currentNodesToAnimate.unshift(currentNode);
    currentNode = board.nodes[currentNode.previousNode];
  }

  timeout(0);

  function timeout(index) {
    if (!currentNodesToAnimate.length) currentNodesToAnimate.push(board.nodes[board.start]);
    setTimeout(function () {
      if (index === 0) {
        shortestPathChange(currentNodesToAnimate[index]);
      } else if (index < currentNodesToAnimate.length) {
        shortestPathChange(currentNodesToAnimate[index], currentNodesToAnimate[index - 1]);
      } else if (index === currentNodesToAnimate.length) {
        shortestPathChange(board.nodes[board.target], currentNodesToAnimate[index - 1], "isActualTarget");
      }
      if (index > currentNodesToAnimate.length) {
        board.toggleButtons();
        return;
      }
      timeout(index + 1);
    }, 40)
  }

  function shortestPathChange(currentNode, previousNode, isActualTarget) {
    if (currentNode.id !== board.start) {
      if (currentNode.id !== board.target || currentNode.id === board.target && isActualTarget) {
        let currentHTMLNode = document.getElementById(currentNode.id);
        if (currentNode.direction) {
          currentHTMLNode.className = "shortest-path-" + currentNode.direction;
        } else {
          currentHTMLNode.className = "shortest-path-unweighted";
        }
      }
    }
    if (previousNode) {
      if (previousNode.id !== board.target && previousNode.id !== board.start) {
        let previousHTMLNode = document.getElementById(previousNode.id);
        previousHTMLNode.className = previousNode.weight === 15 ? "shortest-path weight" : "shortest-path";
      }
    } else {
      let element = document.getElementById(board.start);
      element.className = "startTransparent";
    }
  }
}
