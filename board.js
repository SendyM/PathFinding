
class Board {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.start = null;
    this.target = null;
    this.nodes = {};
    this.nodesToAnimate = [];
    this.shortestPathNodesToAnimate = [];
    this.wallsToAnimate = [];
    this.mouseDown = false;
    this.pressedNodeStatus = "normal";
    this.previouslyPressedNodeStatus = null;
    this.previouslySwitchedNode = null;
    this.previouslySwitchedNodeWeight = 0;
    this.currentAlgorithm = null;
    this.buttonsOn = false;
    this.speed = "seventyfive";
    this.block = "Wall";
  }

  initialise() {
    this.createGrid();
    this.addEventListeners();
    this.toggleButtons();
  }

  createGrid() {
    let tableHTML = "";
    let halfHeight = Math.floor(this.height / 2);
    let quarterWidth = Math.floor(this.width / 4);
    for (let r = 0; r < this.height; r++) {
      let currentHTMLRow = `<tr id="row ${r}">`;
      for (let c = 0; c < this.width; c++) {
        let newNodeId = coordinates2id(r, c);
        let newNodeClass = "unvisited";
        if (r === halfHeight && c === quarterWidth) {
          newNodeClass = "start";
          this.start = newNodeId;
        } else if (r === halfHeight && c === 3 * quarterWidth) {
          newNodeClass = "target";
          this.target = newNodeId;
        }
        let newNode = new BoardNode(newNodeId, newNodeClass);
        currentHTMLRow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
        this.nodes[newNodeId] = newNode;
      }
      tableHTML += `${currentHTMLRow}</tr>`;
    }
    document.getElementById("board").innerHTML = tableHTML;
  }

  addEventListeners() {
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        let currentId = coordinates2id(r, c);
        let currentNode = this.nodes[currentId];
        let currentElement = document.getElementById(currentId);
        currentElement.onmousedown = (e) => {
          e.preventDefault();
          if (this.buttonsOn) {
            this.mouseDown = true;
            if (currentNode.status === "start" || currentNode.status === "target") {
              this.pressedNodeStatus = currentNode.status;
            } else {
              this.pressedNodeStatus = "normal";
              this.changeNormalNode(currentNode);
            }
          }
        }
        currentElement.onmouseup = () => {
          if (this.buttonsOn) {
            this.mouseDown = false;
            if (this.pressedNodeStatus === "target") {
              this.target = currentId;
            } else if (this.pressedNodeStatus === "start") {
              this.start = currentId;
            }
            this.pressedNodeStatus = "normal";
          }
        }
        currentElement.onmouseenter = () => {
          if (this.buttonsOn) {
            if (this.mouseDown && this.pressedNodeStatus !== "normal") {
              this.changeSpecialNode(currentNode);
              if (this.pressedNodeStatus === "target") {
                this.target = currentId;
              } else if (this.pressedNodeStatus === "start") {
                this.start = currentId;
              }
            } else if (this.mouseDown) {
              this.changeNormalNode(currentNode);
            }
          }
        }
        currentElement.onmouseleave = () => {
          if (this.buttonsOn) {
            if (this.mouseDown && this.pressedNodeStatus !== "normal") {
              this.changeSpecialNode(currentNode);
            }
          }
        }
      }
    }
  }

  changeSpecialNode(currentNode) {
    let element = document.getElementById(currentNode.id), previousElement;
    if (this.previouslySwitchedNode) {
      previousElement = document.getElementById(this.previouslySwitchedNode.id);
    }
    if (currentNode.status !== "target" && currentNode.status !== "start") {
      if (this.previouslySwitchedNode) {
        this.previouslySwitchedNode.status = this.previouslyPressedNodeStatus;
        previousElement.className = this.previouslySwitchedNodeWeight === 15 ?
          "unvisited weight" : this.previouslyPressedNodeStatus;
        this.previouslySwitchedNode.weight = this.previouslySwitchedNodeWeight === 15 ?
          15 : 0;
        this.previouslySwitchedNode = null;
        this.previouslySwitchedNodeWeight = currentNode.weight;

        this.previouslyPressedNodeStatus = currentNode.status;
        element.className = this.pressedNodeStatus;
        currentNode.status = this.pressedNodeStatus;
        currentNode.weight = 0;
      }
    } else if (currentNode.status !== this.pressedNodeStatus) {
      this.previouslySwitchedNode.status = this.pressedNodeStatus;
      previousElement.className = this.pressedNodeStatus;
    } else if (currentNode.status === this.pressedNodeStatus) {
      this.previouslySwitchedNode = currentNode;
      element.className = this.previouslyPressedNodeStatus;
      currentNode.status = this.previouslyPressedNodeStatus;
    }
  }

  changeNormalNode(currentNode) {
    let element = document.getElementById(currentNode.id);
    let relevantStatuses = ["start", "target"];
    if (this.block === "Wall") {
      if (!relevantStatuses.includes(currentNode.status)) {
        element.className = currentNode.status !== "wall" ? "wall" : "unvisited";
        currentNode.status = element.className !== "wall" ? "unvisited" : "wall";
        currentNode.weight = 0;
      }
    } else if (this.block === "Weight") {
      if (!relevantStatuses.includes(currentNode.status)) {
        element.className = currentNode.weight !== 15 ? "unvisited weight" : "unvisited";
        currentNode.weight = element.className !== "unvisited weight" ? 0 : 15;
        currentNode.status = "unvisited";
      }
    }
  }

  /** Vykreslenie najdenej cesty bez animacie. */
  drawShortestPath(targetNodeId, startNodeId) {
    let currentNode;
    currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
    while (currentNode.id !== startNodeId) {
      this.shortestPathNodesToAnimate.unshift(currentNode);
      document.getElementById(currentNode.id).className = `shortest-path`;
      currentNode = this.nodes[currentNode.previousNode];
    }
    this.toggleButtons();
  }

  /** Vykreslenie najdenej cesty s animaciou. */
  drawShortestPathTimeout(targetNodeId, startNodeId) {
    let board = this;
    let currentNode;
    let secondCurrentNode;
    let currentNodesToAnimate;

    currentNode = board.nodes[board.nodes[targetNodeId].previousNode];
    currentNodesToAnimate = [];
    while (currentNode.id !== startNodeId) {
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
          let direction = "direction";
          if (currentNode[direction] === "up") {
            currentHTMLNode.className = "shortest-path-up";
          } else if (currentNode[direction] === "down") {
            currentHTMLNode.className = "shortest-path-down";
          } else if (currentNode[direction] === "right") {
            currentHTMLNode.className = "shortest-path-right";
          } else if (currentNode[direction] === "left") {
            currentHTMLNode.className = "shortest-path-left";
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

  createMazeOne(type) {
    Object.keys(this.nodes).forEach(node => {
      let random = Math.random();
      let currentHTMLNode = document.getElementById(node);
      let relevantClassNames = ["start", "target"]
      let randomTwo = type === "wall" ? 0.25 : 0.35;
      if (random < randomTwo && !relevantClassNames.includes(currentHTMLNode.className)) {
        if (type === "wall") {
          currentHTMLNode.className = "wall";
          this.nodes[node].status = "wall";
          this.nodes[node].weight = 0;
        } else if (type === "weight") {
          currentHTMLNode.className = "unvisited weight";
          this.nodes[node].status = "unvisited";
          this.nodes[node].weight = 15;
        }
      }
    });
  }

  clearPath(clickedButton) {
    if (clickedButton) {
      let start = this.nodes[this.start];
      let target = this.nodes[this.target];
      start.status = "start";
      document.getElementById(start.id).className = "start";
      target.status = "target";
      document.getElementById(target.id).className = "target";
    }

    Object.keys(this.nodes).forEach(id => {
      let currentNode = this.nodes[id];
      currentNode.reset(currentNode.status)
      let currentHTMLNode = document.getElementById(id);
      let relevantStatuses = ["wall", "start", "target"];
      if (!relevantStatuses.includes(currentNode.status) && currentNode.weight !== 15) {
        currentNode.status = "unvisited";
        currentHTMLNode.className = "unvisited";
      } else if (currentNode.weight === 15) {
        currentNode.status = "unvisited";
        currentHTMLNode.className = "unvisited weight";
      }
    });
  }

  clearWalls() {
    this.clearPath("clickedButton");
    Object.keys(this.nodes).forEach(id => {
      let currentNode = this.nodes[id];
      let currentHTMLNode = document.getElementById(id);
      if (currentNode.status === "wall" || currentNode.weight === 15) {
        currentNode.status = "unvisited";
        currentNode.weight = 0;
        currentHTMLNode.className = "unvisited";
      }
    });
  }

  clearWeights() {
    Object.keys(this.nodes).forEach(id => {
      let currentNode = this.nodes[id];
      let currentHTMLNode = document.getElementById(id);
      if (currentNode.weight === 15) {
        currentNode.status = "unvisited";
        currentNode.weight = 0;
        currentHTMLNode.className = "unvisited";
      }
    });
  }

  reset() {
    this.nodes[this.start].status = "start";
    document.getElementById(this.start).className = "startTransparent";
    this.nodes[this.target].status = "target";
  }

  changeStartNodeImages() {
    document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default btn-outline-warning" type="button">'
      + "Spusť " + this.currentAlgorithm.label + '</button>';
    document.getElementById("algorithmDescriptor").innerHTML = this.currentAlgorithm.label + ' ' + this.currentAlgorithm.description;
  }

  toggleButtons() {
    document.getElementById("refreshButton").onclick = () => {
      window.location.reload(true);
    }

    if (!this.buttonsOn) {
      this.buttonsOn = true;

      document.getElementById("startButtonStart").onclick = () => {
        if (this.currentAlgorithm) {
          this.clearPath("clickedButton");
          this.toggleButtons();
          let success = this.currentAlgorithm.run(this.nodes, this.start, this.target, this.nodesToAnimate);
          animateSearch(this, success);
        }
      }

      ["five", "twentyfive", "fifty", "seventyfive", "hundred"].forEach(ele => {
        document.getElementById(ele).onclick = () => {
          this.speed = ele;
        }
      })

      document.getElementById("Wall").onclick = () => {
        this.block = "Wall";
      }
      document.getElementById("Weight").onclick = () => {
        this.block = "Weight";
      }

      document.getElementById("startStairDemonstration").onclick = () => {
        this.clearWalls();
        this.clearPath("clickedButton");
        this.toggleButtons();
        stairDemonstration(this);
        animateMaze(this);
      }

      document.getElementById("startButtonDijkstra").onclick = () => {
        this.currentAlgorithm = new DijkstraAlgorithm()
        this.changeStartNodeImages();
      }

      document.getElementById("startButtonAStar2").onclick = () => {
        this.currentAlgorithm = new AstarAlgorithm()
        this.changeStartNodeImages();
      }

      document.getElementById("startButtonGreedy").onclick = () => {
        this.currentAlgorithm = new GreedyAlgorithm()
        this.changeStartNodeImages();
      }

      document.getElementById("startButtonBFS").onclick = () => {
        this.currentAlgorithm = new BFSAlgorithm()
        this.clearWeights();
        this.changeStartNodeImages();
      }

      document.getElementById("startButtonDFS").onclick = () => {
        this.currentAlgorithm = new DFSAlgorithm()
        this.clearWeights();
        this.changeStartNodeImages();
      }

      document.getElementById("startButtonCreateMazeOne").onclick = () => {
        this.clearWalls();
        this.clearPath("clickedButton");
        this.createMazeOne("wall");
      }

      document.getElementById("startButtonCreateMazeTwo").onclick = () => {
        this.clearWalls();
        this.clearPath("clickedButton");
        this.toggleButtons();
        recursiveDivisionMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false, "wall");
        animateMaze(this);
      }

      document.getElementById("startButtonClearBoard").onclick = () => {

        let navbarHeight = document.getElementById("navbarDiv").clientHeight;
        let textHeight = document.getElementById("algorithmDescriptor").clientHeight;
        let height = Math.floor((document.documentElement.clientHeight - navbarHeight - textHeight) / 28);
        let width = Math.floor(document.documentElement.clientWidth / 25);
        let start = Math.floor(height / 2).toString() + "-" + Math.floor(width / 4).toString();
        let target = Math.floor(height / 2).toString() + "-" + Math.floor(3 * width / 4).toString();

        Object.keys(this.nodes).forEach(id => {
          let currentNode = this.nodes[id];
          let currentHTMLNode = document.getElementById(id);
          if (id === start) {
            currentHTMLNode.className = "start";
            currentNode.reset("start");
          } else if (id === target) {
            currentHTMLNode.className = "target";
            currentNode.reset("target")
          } else {
            currentHTMLNode.className = "unvisited";
            currentNode.reset("unvisited");
          }
        });

        this.start = start;
        this.target = target;
        this.nodesToAnimate = [];
        this.shortestPathNodesToAnimate = [];
        this.wallsToAnimate = [];
        this.mouseDown = false;
        this.pressedNodeStatus = "normal";
        this.previouslyPressedNodeStatus = null;
        this.previouslySwitchedNode = null;
        this.previouslySwitchedNodeWeight = 0;
      }

      document.getElementById("startButtonClearPath").onclick = () => {
        this.clearPath("clickedButton");
      }

      document.getElementById("startButtonCreateMazeThree").onclick = () => {
        this.clearWalls();
        this.clearPath("clickedButton");
        this.toggleButtons();
        otherMaze(this, 2, this.height - 3, 2, this.width - 3, "vertical", false);
        animateMaze(this);
      }

      document.getElementById("startButtonCreateMazeFour").onclick = () => {
        this.clearWalls();
        this.clearPath("clickedButton");
        this.toggleButtons();
        otherOtherMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false);
        animateMaze(this);
      }

    } else {
      this.buttonsOn = false;
      document.getElementById("startButtonDFS").onclick = null;
      document.getElementById("startButtonBFS").onclick = null;
      document.getElementById("startButtonDijkstra").onclick = null;
      document.getElementById("startButtonGreedy").onclick = null;
      document.getElementById("startButtonAStar2").onclick = null;
      document.getElementById("startButtonCreateMazeOne").onclick = null;
      document.getElementById("startButtonCreateMazeTwo").onclick = null;
      document.getElementById("startButtonCreateMazeThree").onclick = null;
      document.getElementById("startButtonCreateMazeFour").onclick = null;
      document.getElementById("startStairDemonstration").onclick = null;
      document.getElementById("startButtonClearPath").onclick = null;
      document.getElementById("startButtonClearBoard").onclick = null;
      document.getElementById("startButtonStart").onclick = null;

    }
  }

}


// main start
let navbarHeight = $("#navbarDiv").height();
let textHeight = $("#algorithmDescriptor").height();
let height = Math.floor(($(document).height() - navbarHeight - textHeight) / 28);
let width = Math.floor($(document).width() / 25);
let newBoard = new Board(height, width)
newBoard.initialise();
