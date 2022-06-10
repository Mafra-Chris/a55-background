import './style.scss'
import 'animate.css';
function createBackground() {

  let svg = document.getElementById("bg-pixel")
  let body = document.getElementsByTagName("body")[0]
  let g = svg.querySelector("g")
  var WIDTH, COLS, ROWS, TOTAL, CENTERX, CENTERY

  function setWindowValues() {
    let minFactor = Math.min(svg.clientWidth, svg.clientHeight)
    WIDTH = minFactor > 1200 ? 45 : minFactor > 950 ? 25 : minFactor > 750 ? 18 : 20
    COLS = Math.floor(svg.clientWidth / WIDTH)
    ROWS = Math.floor(svg.clientHeight / WIDTH)
    TOTAL = (COLS + 1) * (ROWS + 1)
    CENTERX = Math.floor(COLS / 2)
    CENTERY = Math.floor(ROWS / 2)
  }


  let themes = {
    "a55pixel": {
      key: "a55pixel",
      url: "",
      base: "rgba(48, 69, 95, 0.38)",
      solid1: "rgba(48, 69, 95, 0.45)",
      solid2: "rgba(48, 69, 95, 0.55)",
      solid3: "rgba(48, 69, 95, 0.75)",
      time1: 100,
      time2: 200,
      time3: 900,
      func: a55pixel
    },
  }


  async function buildGrid(doDelay = true) {
    setWindowValues()
    if (doDelay) await delay(2000)
    let theme = themes["a55pixel"]
    g.innerHTML = ''
    g.style = ''
    g.style.fill = theme.base
    body.className = theme.className || ""
    body.style.backgroundImage = theme.url ? `url('${theme.url}')` : ""
    buildBoxes(theme.base, theme.gutter)
    theme.func()

  }
  body.onload = () => buildGrid(false)

  /* PRESETS */
  function a55pixel() {

    var arc = themes["a55pixel"]
    const BATCHES = 160
    for (var i = 0; i < BATCHES; i++) {
      oneSquare(arc.solid1, arc.time1)
      oneSquare(arc.solid3, arc.time1)
      oneSquare(arc.solid2, arc.time3)
    }
    quadRunner(arc.solid3, arc.time1)
    quadRunner(arc.solid3, arc.time2)
    quadRunner(arc.solid2, arc.time3)

    async function oneSquare(solid, time) {


      var randomPoint = getRandomPoint()
      let target = getTarget(randomPoint.row, randomPoint.col)
      target.setAttribute("fill", solid)
      await delay(time)
      target.setAttribute("fill", arc.base)
      oneSquare(solid, time)
    }
    async function quadRunner(color, time) {


      let randomPoint = getRandomPoint()
      let row = randomPoint.row
      let col = randomPoint.col
      let t1 = getTarget(row, col)
      let t2 = getTarget(row, col + 1)
      let t3 = getTarget(row + 1, col)
      let t4 = getTarget(row + 1, col + 1)
      t1 && t1.setAttribute("fill", color)
      t2 && t2.setAttribute("fill", color)
      t3 && t3.setAttribute("fill", color)
      t4 && t4.setAttribute("fill", color)
      await delay(time)
      t1 && t1.setAttribute("fill", arc.base)
      t2 && t2.setAttribute("fill", arc.base)
      t3 && t3.setAttribute("fill", arc.base)
      t4 && t4.setAttribute("fill", arc.base)
      quadRunner(color, time)
    }
  }

  /* helpers */
  function buildBoxes(color, gutter) {
    gutter = gutter === undefined ? 1 : gutter
    for (var col = 0; col <= COLS; col++) {
      for (var row = 0; row <= ROWS; row++) {
        let x = WIDTH * col
        let y = WIDTH * row
        drawSquare(row, col, x, y, WIDTH - gutter, WIDTH - gutter, color)
      }
    }
  }

  function Point(row, col, type) {
    this.col = parseInt(col)
    this.row = parseInt(row)
    this.type = type
  }

  function getNextPoint(point) {
    let isEndOfRow = point.col == COLS
    let newRow = isEndOfRow ? point.row + 1 : point.row
    let newCol = isEndOfRow ? 0 : point.col + 1
    if (newRow > ROWS) return undefined
    return new Point(newRow, newCol)
  }

  function getNextPointInDirection(point, direction) {
    let row = point.row
    let col = point.col
    switch (direction) {
      case "north":
        return new Point(row - 1, col)
      case "south":
        return new Point(row + 1, col)
      case "east":
        return new Point(row, col + 1)
      case "west":
        return new Point(row, col - 1)
      case "northEast":
        return new Point(row - 1, col + 1)
      case "southEast":
        return new Point(row + 1, col + 1)
      case "northWest":
        return new Point(row - 1, col - 1)
      case "southWest":
        return new Point(row + 1, col - 1)
    }
  }

  function getRandomMove(from, xRando = Math.random(), yRando = Math.random()) {

    var xMove = xRando > .66 ? 1 : xRando > .33 ? 0 : -1
    var yMove = yRando > .66 ? 1 : yRando > .33 ? 0 : -1

    if (from.row + yMove > ROWS) yMove = 0
    if (from.row + yMove < 0) yMove = 0
    if (from.col + xMove < 0) xMove = 0
    if (from.col + xMove > COLS) xMove = 0

    return new Point(from.row + yMove, from.col + xMove)
  }

  function getRandomPoint() {
    let row = Math.floor(Math.random() * (ROWS + 1))
    let col = Math.floor(Math.random() * (COLS + 1))
    return new Point(row, col)
  }

  function getRandomDirection(not) {

    var generate = () => {
      let seed = Math.random()
      return seed > .75 ? "south" : seed > .5 ? "north" : seed > .25 ? "east" : "west"
    }
    let which = generate()
    while (not && which == not) {
      which = generate()
    }
    return which
  }

  function getTarget(row, col) {
    return document.querySelector(`rect[col='${col}'][row='${row}']`)
  }

  function isBoundary(el) {
    let row = el.getAttribute("row")
    let col = el.getAttribute("col")
    return row == 0 || row == ROWS || col == 0 || col == COLS
  }

  function whichBoundary(el) {
    let row = el.getAttribute("row")
    let col = el.getAttribute("col")
    return row == 0 ? "up" : row == ROWS ? "down" : col == 0 ? "left" : col == COLS ? "right" : undefined
  }

  function isCorner(el) {
    let row = el.getAttribute("row")
    let col = el.getAttribute("col")
    return (row == 0 && col == 0) ||
      (col == 0 && row == ROWS) ||
      (col == COLS && row == ROWS) ||
      (row == 0 && col == COLS)
  }

  function changePreset(e) {
    //document.location.search = `preset=${e.target.value}`
    document.location.replace(document.location.href.replace(/\?preset=\w+$/, "") + `?preset=${e.target.value}`)
  }

  function delay(ms) {
    return new Promise(done => setTimeout(() => {
      done()
    }, ms))
  }

  function drawSquare(row, col, x, y, w, h, color) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    rect.setAttribute("x", x)
    rect.setAttribute("y", y)
    rect.setAttribute("row", row)
    rect.setAttribute("col", col)
    rect.setAttribute("width", w)
    rect.setAttribute("height", h)
    g.appendChild(rect)

  }
}
createBackground()
let logo = document.getElementById("logo")
setTimeout(() => {

  logo.classList.add("done")
}, "2000")

setTimeout(() => {
  let container = document.getElementById("container")
  logo.classList.add("hidden")
  container.classList.remove("hidden")
}, "5000")