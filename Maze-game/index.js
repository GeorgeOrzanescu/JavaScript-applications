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
const box = Bodies.rectangle(200, 200, 40, 40);
const circle = Bodies.circle(400, 400, 20);

Composite.add(world, [box, circle]); // add bodies
Composite.add(world, walls); // add walls

Render.run(render);
Runner.run(Runner.create(), engine);

const cellsVertical = 4;
const cellsHorizontal = 4;

const grid = Array(cellsVertical) // create array for each cell of the grid
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(true));

console.log(grid);
