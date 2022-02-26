
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

  initialize() {
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
          }
        }
        currentElement.onmouseenter = () => {
          if (this.buttonsOn && this.mouseDown) {
            if (this.pressedNodeStatus !== "normal") {
              this.changeSpecialNode(currentNode);
              if (this.pressedNodeStatus === "target") {
                this.target = currentId;
              } else if (this.pressedNodeStatus === "start") {
                this.start = currentId;
              }
            } else {
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

  createBasicRandomMaze() {
    Object.keys(this.nodes).forEach(node => {
      let random = Math.random();
      let currentHTMLNode = document.getElementById(node);
      let relevantClassNames = ["start", "target"]
      if (random < 0.25 && !relevantClassNames.includes(currentHTMLNode.className)) {
        currentHTMLNode.className = "wall";
        this.nodes[node].status = "wall";
        this.nodes[node].weight = WEIGHT_DEFAULT;
      }
    });
  }

  clearPath() {
    let start = this.nodes[this.start];
    let target = this.nodes[this.target];
    start.status = "start";
    document.getElementById(start.id).className = "start";
    target.status = "target";
    document.getElementById(target.id).className = "target";

    Object.keys(this.nodes).forEach(id => {
      let currentNode = this.nodes[id];
      currentNode.reset(currentNode.status)
      let currentHTMLNode = document.getElementById(id);
      let relevantStatuses = ["wall", "start", "target"];
      if (!relevantStatuses.includes(currentNode.status)) {
        currentNode.status = "unvisited";
        currentHTMLNode.className = currentNode.weight === WEIGHT_DEFAULT ? "unvisited" : "unvisited weight";
      }
    });
  }

  clearWalls() {
    this.clearPath();
    Object.keys(this.nodes).forEach(id => {
      let currentNode = this.nodes[id];
      let currentHTMLNode = document.getElementById(id);
      if (currentNode.status === "wall" || currentNode.weight !== WEIGHT_DEFAULT) {
        currentNode.status = "unvisited";
        currentNode.weight = WEIGHT_DEFAULT;
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
    if (this.buttonsOn) {
      this.buttonsOn = false;
      this.setButtonsOff();
    } else {
      this.buttonsOn = true;
      this.setButtonsOn();
    }
  }

  setButtonsOff() {
    document.getElementById("startButtonStart").onclick = null;
    document.getElementById("startButtonDFS").onclick = null;
    document.getElementById("startButtonBFS").onclick = null;
    document.getElementById("startButtonDijkstra").onclick = null;
    document.getElementById("startButtonGreedy").onclick = null;
    document.getElementById("startButtonAStar").onclick = null;
    document.getElementById("startButtonBasicRandomMaze").onclick = null;
    document.getElementById("startButtonRecursiveMaze").onclick = null;
    document.getElementById("startStairDemonstration").onclick = null;
    document.getElementById("startButtonClearPath").onclick = null;
    document.getElementById("startButtonClearBoard").onclick = null;
  }

  setButtonsOn() {
    document.getElementById("startButtonStart").onclick = () => {
      if (this.currentAlgorithm) {
        this.clearPath();
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

    document.getElementById("startButtonDijkstra").onclick = () => {
      this.currentAlgorithm = new DijkstraAlgorithm()
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonAStar").onclick = () => {
      this.currentAlgorithm = new AstarAlgorithm()
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonGreedy").onclick = () => {
      this.currentAlgorithm = new GreedyAlgorithm()
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonBFS").onclick = () => {
      this.currentAlgorithm = new BFSAlgorithm()
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonDFS").onclick = () => {
      this.currentAlgorithm = new DFSAlgorithm()
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonBasicRandomMaze").onclick = () => {
      this.clearWalls();
      this.clearPath();
      this.createBasicRandomMaze();
    }

    document.getElementById("startButtonRecursiveMaze").onclick = () => {
      this.clearWalls();
      this.clearPath();
      this.toggleButtons();
      recursiveDivisionMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false, "wall");
      animateMaze(this);
    }

    document.getElementById("startStairDemonstration").onclick = () => {
      this.clearWalls();
      this.clearPath();
      this.toggleButtons();
      stairDemonstration(this);
      animateMaze(this);
    }

    document.getElementById("startButtonClearBoard").onclick = () => {
      this.initialize();
      this.toggleButtons();
    }

    document.getElementById("startButtonClearPath").onclick = () => {
      this.clearPath();
    }

  }
}


// main start
let navbarHeight = $("#navbarDiv").height();
let textHeight = $("#algorithmDescriptor").height();
let height = Math.floor(($(document).height() - navbarHeight - textHeight) / 28);
let width = Math.floor($(document).width() / 25);
let newBoard = new Board(height, width)
newBoard.initialize();
