// shuffle function for random neighbors

const shuffleNeighbors = (neighbors) => {
  let counter = neighbors.length;

  for (let i = 0; i < 4; i++) {
    const rIndex = Math.floor(Math.random() * counter);
    counter--;
    const temp = neighbors[counter];
    neighbors[counter] = neighbors[rIndex];
    neighbors[rIndex] = temp;
  }

  return neighbors;
};
