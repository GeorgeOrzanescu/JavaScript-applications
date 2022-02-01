#!/usr/bin/env node

import fs from "fs";
import chalk from "chalk";
// fs.readdir(process.cwd(), async (err, fileNames) => {
//   if (err) {
//     console.log(err);
//     // throw new Error(err);
//   }

// bad version although it works
/*
  for (let filename of fileNames) {
    fs.lstat(filename, (err, stats) => {
      if (err) {
        console.log(err);
      }
      console.log(filename, "  ", stats.isFile());
    });
  }


  */
// callback array solution 1 ----------------------------------------------------------------------
/* const allStats = Array(fileNames.length).fill(null);

  for (let filename of fileNames) {
    const index = fileNames.indexOf(filename);

    fs.lstat(filename, (err, stats) => {
      if (err) {
        console.log(err);
      }
      allStats[index] = stats;
      const ready = allStats.every((stats) => {
        return stats;
      });

      if (ready) {
        allStats.forEach((stats, index) => {
          console.log(fileNames[index], "  ", stats.isFile());
        });
      }
    });
  }
  */

// solution 2 using promises ----------------------------------------------------------------------

// const lstat = (filename) => {
//   return new Promise((resolve, reject) => {
//     fs.lstat(filename, (err, stats) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(stats);
//     });
//   });
// };

// for (let filename of fileNames) {
//   try {
//     const stats = await lstat(filename);
//     console.log(filename, stats.isFile());
//   } catch (err) {
//     console.log(err);
//   }
// }

// // solution 3 a blend of the two above ----------------------------------------------------------------------
const { lstat } = fs.promises;

fs.readdir(process.cwd(), async (err, filenames) => {
  if (err) {
    console.log(err);
  }

  const statPromises = filenames.map((filename) => {
    return lstat(filename);
  });

  const allStats = await Promise.all(statPromises);

  for (let stats of allStats) {
    const index = allStats.indexOf(stats);

    if (stats.isFile()) {
      console.log(filenames[index]);
    } else {
      console.log(chalk.white(filenames[index]));
    }
    // console.log(filenames[index], stats.isFile());
  }
});

// });
