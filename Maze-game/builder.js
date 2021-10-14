const BuildWorld = () => {
  engine.world.gravity.y = 0;
  // build walls
  const walls = [
    Bodies.rectangle(width / 2, 0, width, 5, { isStatic: true }), // upper
    Bodies.rectangle(width / 2, height, width, 5, { isStatic: true }), // lower
    Bodies.rectangle(width, height / 2, 5, height, { isStatic: true }), // right
    Bodies.rectangle(0, height / 2, 5, height, { isStatic: true }), // left
  ];
  Composite.add(world, walls);
};

const CreateHorizontals = () => {
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
};

const CreateVerticals = () => {
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
};

const Replay = () => {
  BuildWorld();
  createMaze(
    Math.floor(Math.random() * cellsVertical),
    Math.floor(Math.random() * cellsHorizontal)
  );

  CreateHorizontals();
  CreateVerticals();
};

const CreatePlayerFinish = () => {
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
};
