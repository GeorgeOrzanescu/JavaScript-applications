// Destructure the modules we need from the Matter.js library

const { Engine, Composite, Render, Bodies, Runner } = Matter;

/* Runner --> module is an optional utility which provides a game loop,
 that handles continuously updating a Matter.Engine for you within a browser
*/

const engine = Engine.create();
const world = engine.world; // world is created by the engine

const render = Render.create({
  element: document.body, // where to create the render
  engine: engine, // what engine to use
  options: {
    width: 800,
    height: 800,
    wireframes: false, // default is true bodies don't fall
  },
});

// create bodies
const box = Bodies.rectangle(200, 200, 40, 40);
const circle = Bodies.circle(400, 400, 20);

Composite.add(world, [box, circle]); // add bodies

Render.run(render);
Runner.run(Runner.create(), engine);
