// Destructure the modules we need from the Matter.js library

const { Engine, Composite, Render, Bodies, Runner } = Matter;

/* Runner --> module is an optional utility which provides a game loop,
 that handles continuously updating a Matter.Engine for you within a browser
*/

const engine = Engine.create();
const world = engine.world; // world is created by the engine

const width = 800;
const height = 800;

const render = Render.create({
  element: document.body, // where to create the render
  engine: engine, // what engine to use
  options: {
    width: width,
    height: height,
    wireframes: false, // default is true bodies don't fall
  },
});

//create border around the world
const walls = [
  Bodies.rectangle(width / 2, 0, width, 10, { isStatic: true }), // upper
  Bodies.rectangle(width / 2, height, width, 10, { isStatic: true }), // lower
  Bodies.rectangle(width, height / 2, 10, height, { isStatic: true }), // right
  Bodies.rectangle(0, height / 2, 10, height, { isStatic: true }), // left
];

// create bodies
// const box = Bodies.rectangle(200, 200, 40, 40);
// const circle = Bodies.circle(400, 400, 20);

// Composite.add(world, [box, circle]); // add bodies
Composite.add(world, walls); // add walls

Render.run(render);
Runner.run(Runner.create(), engine);

const cellsVertical = 4;
const cellsHorizontal = 4;

const grid = Array(cellsVertical) // create array for each cell of the grid
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(true));

const verticals = Array(cellsVertical) // array for position of vertical walls
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(true));

const horizontals = Array(cellsVertical - 1) // array for position of horizontal walls
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(true));

// create a random row and column to start the maze creation from
const startRow = Math.floor(Math.random() * cellsHorizontal);
const startCol = Math.floor(Math.random() * cellsVertical);

/* Maze creation steps:
  1 mark this cell as visited
  2 Assemble randomly-ordered list of neighbors
  3 for each neighbor ...
       check to see if neighbor is out of the grid (cell that doesn't exist)
       If we have visited that neighbor continue to next neighbor
       Mark the position of vertical and horizontal walls 
  4 recursive --> next neighbor

*/

const createMaze = (row, col) => {
  console.log(row, col);
  //condition to exit recursivity
  if (!grid[row][col]) {
    return;
  }

  // 1
  grid[row][col] = false; // mark the starting cell as visited = false
  // 2
  const neighbors = shuffleNeighbors([
    [row - 1, col, "up"], // up
    [row + 1, col, "down"], // down
    [row, col + 1, "right"], //right
    [row, col - 1, "left"], //left
  ]);
  // 3
  for (let neighbor of neighbors) {
    console.log(neighbor);
    const [nextRow, nextCol, direction] = neighbor;
    if (
      nextRow < 0 ||
      nextCol < 0 ||
      nextRow >= cellsVertical ||
      nextCol >= cellsHorizontal
    ) {
      continue; // skip's the invalid neighbor
    }
    if (!grid[nextRow][nextCol]) {
      continue; // if the cell is visited already skip
    }
    // mark where walls should not be drawn
    if (direction === "up") {
      horizontals[row - 1][col] = false;
    } else if (direction === "down") {
      horizontals[row][col] = false;
    }

    if (direction === "right") {
      verticals[row][col] = false;
    } else if (direction === "left") {
      verticals[row][col - 1] = false;
    }
    // 4
    createMaze(nextRow, nextCol);
  }
};

createMaze(startRow, startCol);

// horizontal walls creation
const unit = 200;

for (let row of horizontals) {
  console.log(row);
  for (let position in row) {
    console.log(row[position]);
    if (row[position]) {
      const wall = Bodies.rectangle(
        position * unit + unit / 2,
        horizontals.indexOf(row) * unit + unit,
        unit,
        5,
        {
          isStatic: true,
        }
      );
      Composite.add(world, wall);
    }
  }
}

// vertical walls creation

for (let row of verticals) {
  for (let position in row) {
    if (row[position]) {
      const wall = Bodies.rectangle(
        position * unit + unit,
        verticals.indexOf(row) * unit + unit / 2,
        5,
        unit,
        {
          isStatic: true,
        }
      );
      Composite.add(world, wall);
    }
  }
}
