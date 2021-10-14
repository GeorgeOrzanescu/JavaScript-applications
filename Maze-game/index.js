// Destructure the modules we need from the Matter.js library

const { Engine, Composite, Render, Bodies, Runner, Body, Events } = Matter;

/* Runner --> module is an optional utility which provides a game loop,
 that handles continuously updating a Matter.Engine for you within a browser
*/

const engine = Engine.create();
engine.world.gravity.y = 0;
const world = engine.world; // world is created by the engine

// number of cells in the grid (square so its equal )
const cellsHorizontal = 3;
const cellsVertical = 3;

const width = window.innerWidth;
const height = window.innerHeight;

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
  Bodies.rectangle(width / 2, 0, width, 5, { isStatic: true }), // upper
  Bodies.rectangle(width / 2, height, width, 5, { isStatic: true }), // lower
  Bodies.rectangle(width, height / 2, 5, height, { isStatic: true }), // right
  Bodies.rectangle(0, height / 2, 5, height, { isStatic: true }), // left
];

// create bodies
// const box = Bodies.rectangle(200, 200, 40, 40);
// const circle = Bodies.circle(400, 400, 20);

// Composite.add(world, [box, circle]); // add bodies
Composite.add(world, walls); // add walls

Render.run(render);
Runner.run(Runner.create(), engine);

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

let grid = Array(cellsVertical) // create array for each cell of the grid
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(true));

let verticals = Array(cellsVertical) // array for position of vertical walls
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(true));

let horizontals = Array(cellsVertical - 1) // array for position of horizontal walls
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(true));

// helper function to clear the arrays after user click's play again
const ClearArrays = () => {
  grid.forEach((row) => row.fill(true));

  verticals.forEach((row) => row.fill(true));

  horizontals.forEach((row) => row.fill(true));
};

// create a random row and column to start the maze creation from
// let startRow = Math.floor(Math.random() * cellsVertical);
// let startCol = Math.floor(Math.random() * cellsHorizontal);

/* Maze creation steps:
  1 mark this cell as visited
  2 Assemble randomly-ordered list of neighbors
  3 for each neighbor ...
       check to see if neighbor is out of the grid (cell that doesn't exist)
       If we have visited that neighbor continue to next neighbor
       Mark the position of vertical and horizontal walls 
  4 recursive --> next neighbor

*/

const createMaze = (startRow, startCol) => {
  //condition to exit recursivity
  console.log("inside create");
  if (!grid[startRow][startCol]) {
    return;
  }

  // 1
  grid[startRow][startCol] = false; // mark the starting cell as visited = false
  // 2
  const neighbors = shuffleNeighbors([
    [startRow - 1, startCol, "up"], // up
    [startRow + 1, startCol, "down"], // down
    [startRow, startCol + 1, "right"], //right
    [startRow, startCol - 1, "left"], //left
  ]);
  // 3
  for (let neighbor of neighbors) {
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
      horizontals[startRow - 1][startCol] = false;
    } else if (direction === "down") {
      horizontals[startRow][startCol] = false;
    }

    if (direction === "right") {
      verticals[startRow][startCol] = false;
    } else if (direction === "left") {
      verticals[startRow][startCol - 1] = false;
    }

    // 4
    createMaze(nextRow, nextCol);
  }
};

createMaze(
  Math.floor(Math.random() * cellsVertical),
  Math.floor(Math.random() * cellsHorizontal)
);

// horizontal walls creation
for (let row of horizontals) {
  for (let position in row) {
    if (row[position]) {
      const wall = Bodies.rectangle(
        position * unitLengthX + unitLengthX / 2,
        horizontals.indexOf(row) * unitLengthY + unitLengthY,
        unitLengthX,
        5,
        {
          label: "wall",
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
        position * unitLengthX + unitLengthX,
        verticals.indexOf(row) * unitLengthY + unitLengthY / 2,
        5,
        unitLengthY,
        {
          label: "wall",
          isStatic: true,
        }
      );
      Composite.add(world, wall);
    }
  }
}

// create finish point
const finish = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.6,
  unitLengthY * 0.6,
  {
    label: "finish",
    isStatic: true,
    render: {
      fillStyle: "green",
    },
  }
);

// create player avatar
const player = Bodies.circle(
  unitLengthX / 2,
  unitLengthY / 2,
  Math.min(unitLengthY, unitLengthX) * 0.3,
  {
    label: "player",
    render: {
      fillStyle: "yellow",
    },
  }
);
Composite.add(world, [finish, player]);

// CONTROL OF THE AVATAR with "wasd" keys

document.addEventListener("keydown", (event) => {
  const { x, y } = player.velocity; // destructure velocity of the avatar

  if (event.code === "KeyW") {
    // move UP
    Body.setVelocity(player, { x, y: y - 5 });
  }
  if (event.code === "KeyD") {
    // move RIGHTww
    Body.setVelocity(player, {
      x: x + 5,
      y: y + 5,
    });
  }
  if (event.code === "KeyS") {
    // move DOWN
    Body.setVelocity(player, { x, y: y + 5 });
  }
  if (event.code === "KeyA") {
    // move LEFT
    Body.setVelocity(player, { x: x - 5, y });
  }
});

// DETECT WIN CONDITION --> collision between player and finish

const labels = ["player", "finish"];
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      world.gravity.y = 1; // turn gravity back on
      world.bodies.forEach((body) => {
        // remove static property of walls
        if (body.label == "wall") {
          Body.setStatic(body, false);
          document.querySelector(".winner").classList.remove("hidden");
          document.querySelector(".replay").classList.remove("hidden");
        }
      });
    }
  });
});

// button's for replay
const yesButton = document.querySelector(".yButton");
yesButton.addEventListener("click", (event) => {
  document.querySelector(".winner").classList.add("hidden");
  document.querySelector(".replay").classList.add("hidden");

  event.preventDefault();
  Composite.clear(world);
  // Engine.clear(engine);
  BuildWorld();
  ClearArrays();
  Replay();
  CreatePlayerFinish();
});

const noButton = document.querySelector(".nButton");
noButton.addEventListener("click", (event) => {
  document.querySelector(".winner").classList.add("hidden");
  document.querySelector(".replay").classList.add("hidden");
});
