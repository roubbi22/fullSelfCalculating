const fs = require("fs");
const genrateLuaContent = require("./functions/genrateLuaContent");
const { exec } = require("child_process");
const Excel = require("exceljs");

const beginTime = new Date();

const readJson = async () => {
  try {
    const jsonString = await fs.promises.readFile(
      "./iterateMultiple.json",
      "utf8"
    );
    const { parameters, iterate } = JSON.parse(jsonString);
    return { parameters, iterate };
  } catch (err) {
    console.log("Error reading file from disk or parsing JSON string:", err);
  }
};

const generateLuaFile = async () => {
  const { parameters, iterate } = await readJson();

  // const calcOrder = JSON.stringify(
  //   iterate.reduce((acc, curr) => {
  //     let parameterCalcOrder = [];
  //     for (let n = curr.beginAt; n <= curr.endAt; n += curr.step) {
  //       parameterCalcOrder.push(`./iterations/${curr.parameter}/${n}`);
  //     }
  //     return [...acc, ...parameterCalcOrder];
  //   }, []),
  //   null,
  //   2
  // );

  // //save calcOrder to json file
  // fs.writeFile(`./calcOrder.json`, calcOrder, (err) => {
  //   if (err) throw err;
  //   console.log("calcOrder.json has been saved!");
  // });

  // // await new Promise((resolve) => setTimeout(resolve, 10000));

  // if (!fs.existsSync("./iterations")) {
  //   fs.mkdir("./iterations", (err) => {
  //     if (err) throw err;
  //     console.log(`created ./iterations directory`);
  //   });
  //   await new Promise((resolve) => setTimeout(resolve, 100));
  // }

  // for (const iteratedParam of iterate) {
  //   console.log(`\n\nsetting up structure for ${iteratedParam.parameter}: \n`);

  //   if (!fs.existsSync(`./iterations/${iteratedParam.parameter}`)) {
  //     fs.mkdir(`./iterations/${iteratedParam.parameter}`, (err) => {
  //       if (err) throw err;
  //       console.log(
  //         `created ./iterations/${iteratedParam.parameter} directory`
  //       );
  //     });
  //     await new Promise((resolve) => setTimeout(resolve, 100));
  //   }

  //   if (
  //     !fs.existsSync(`./iterations/${iteratedParam.parameter}/densityplots`)
  //   ) {
  //     fs.mkdir(
  //       `./iterations/${iteratedParam.parameter}/densityplots`,
  //       (err) => {
  //         if (err) throw err;
  //         console.log(
  //           `created ./iterations/${iteratedParam.parameter}/densityplots directory`
  //         );
  //       }
  //     );
  //     await new Promise((resolve) => setTimeout(resolve, 100));
  //   }

  //   for (
  //     let n = iteratedParam.beginAt;
  //     n <= iteratedParam.endAt;
  //     n += iteratedParam.step
  //   ) {
  //     if (!fs.existsSync(`./iterations/${iteratedParam.parameter}/${n}`)) {
  //       fs.mkdir(`./iterations/${iteratedParam.parameter}/${n}`, (err) => {
  //         if (err) throw err;
  //         console.log(
  //           `created ./iterations/${iteratedParam.parameter}/${n} directory`
  //         );
  //       });
  //     }

  //     const { parameters } = await readJson();
  //     parameters[iteratedParam.parameter] = n;

  //     const luaContent = genrateLuaContent(parameters);
  //     // wait 0.1 seconds
  //     await new Promise((resolve) => setTimeout(resolve, 100));
  //     fs.writeFile(
  //       `./iterations/${iteratedParam.parameter}/${n}/generatorParams.lua`,
  //       luaContent,
  //       (err) => {
  //         if (err) throw err;
  //         console.log(
  //           `Lua file has been saved with ${iteratedParam.parameter} = ${n}!`
  //         );
  //       }
  //     );
  //     await new Promise((resolve) => setTimeout(resolve, 100));
  //   }
  // }
};

generateLuaFile()
  .then(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("all subdirectories created!");
  })
  // .then(async () => {
  //   // iterate trough all folders in iterations
  //   const calcOrder = JSON.parse(
  //     await fs.promises.readFile("./calcOrder.json", "utf8")
  //   );

  //   let currentParameter = "";

  //   for (let i in calcOrder) {
  //     const parameter = calcOrder[i].split("/")[2];
  //     const value = calcOrder[i].split("/")[3];
  //     if (calcOrder[i].split("/")[2] !== currentParameter) {
  //       currentParameter = calcOrder[i].split("/")[2];
  //       console.log(`\n\n ${currentParameter}: \n`);
  //     }

  //     // load generatorParams.lua as a string
  //     const genratorLua = await fs.promises.readFile(`./generator.lua`, "utf8");

  //     console.log(`generating template.FEM for ${parameter} = ${value}...`);

  //     // replace generatorParams.lua with the current iteration
  //     const genratorLuaWithParams = genratorLua
  //       .replace(
  //         /generatorParams.lua/g,
  //         `./iterations/${parameter}/${value}/generatorParams.lua`
  //       )
  //       .replace(
  //         /template.FEM/g,
  //         `./iterations/${parameter}/${value}/template.FEM`
  //       );

  //     // write the new generatorTemp.lua
  //     fs.writeFile(`./generatorTemp.lua`, genratorLuaWithParams, (err) => {
  //       if (err) throw err;
  //     });

  //     // open femm
  //     exec(
  //       `C:/femm42/bin/femm.exe -lua-script=./generatorTemp.lua`,
  //       (err, stdout, stderr) => {
  //         if (err) {
  //           console.error(`exec error: ${err}`);
  //           return;
  //         }
  //       }
  //     );

  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     let femmStillOpen = true;
  //     while (femmStillOpen) {
  //       exec(`tasklist /FI "IMAGENAME eq femm.exe"`, (err, stdout, stderr) => {
  //         if (err) {
  //           console.error(`exec error: ${err}`);
  //           return;
  //         }
  //         if (stdout.includes("femm.exe")) {
  //           femmStillOpen = true;
  //         } else {
  //           femmStillOpen = false;
  //         }
  //       });
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //     }
  //   }
  // })
  .then(async () => {
    const calcOrder = JSON.parse(
      await fs.promises.readFile("./calcOrder.json", "utf8")
    );

    let currentParameter = "";

    for (let i in calcOrder) {
      const parameter = calcOrder[i].split("/")[2];
      const value = calcOrder[i].split("/")[3];
      if (calcOrder[i].split("/")[2] !== currentParameter) {
        currentParameter = calcOrder[i].split("/")[2];
        console.log(`\n\n ${currentParameter}: \n`);
      }

      const genratorLua = await fs.promises.readFile(
        `./magFluxPicture.lua`,
        "utf8"
      );
      // replace generatorParams.lua with the current iteration
      const genratorLuaWithParams = genratorLua
        .replace(/root/g, `./iterations/${parameter}`)
        .replace(/parameterValue/g, `${value}`);
      // write the new generatorTemp.lua
      fs.writeFile(`./magFluxPictureTemp.lua`, genratorLuaWithParams, (err) => {
        if (err) throw err;
        // console.log("Lua file has been saved!");
      });

      console.log(
        `generating flux density plot for ${parameter} = ${value}....`
      );

      exec(
        `C:/femm42/bin/femm.exe -lua-script=./magFluxPictureTemp.lua`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`exec error: ${err}`);
            return;
          }
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      let femmStillOpen = true;
      while (femmStillOpen) {
        exec(`tasklist /FI "IMAGENAME eq femm.exe"`, (err, stdout, stderr) => {
          if (err) {
            console.error(`exec error: ${err}`);
            return;
          }
          if (stdout.includes("femm.exe")) {
            femmStillOpen = true;
          } else {
            femmStillOpen = false;
          }
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  })
  .then(async () => {
    const analysisBeginTime = new Date();
    console.log(
      `                                                                                           
      \n\n*****************\nRunning analysis\n\n*****************\n`
    );

    const calcOrder = JSON.parse(
      await fs.promises.readFile("./calcOrder.json", "utf8")
    );

    let currentParameter = "";

    for (let i in calcOrder) {
      const parameter = calcOrder[i].split("/")[2];
      const value = calcOrder[i].split("/")[3];
      if (calcOrder[i].split("/")[2] !== currentParameter) {
        currentParameter = calcOrder[i].split("/")[2];
        console.log(`                                                                               \n
        \n ${currentParameter}: \n`);
      }

      // copy the template.FEM to ./analysis directory
      fs.copyFile(
        `./iterations/${parameter}/${value}/template.FEM`,
        `./analysis/template.FEM`,
        (err) => {
          if (err) throw err;
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
      // change directory to ./analysis
      process.chdir("./analysis");

      console.log(
        `running analysis for ${parameter} = ${value}...                                            \n`
      );
      const progress = Math.floor((20 * i) / calcOrder.length);
      let progressBar = "";
      for (let n = 0; n < progress; n++) {
        progressBar += "#";
      }
      for (let n = progress; n < 20; n++) {
        progressBar += "_";
      }

      const CurrentTime = new Date();
      const remainingSeconds =
        i < 1
          ? 0
          : Math.ceil(
              (((new Date() - analysisBeginTime) / 1000) *
                (calcOrder.length - i)) /
                i
            );

      const ETATime = new Date(
        CurrentTime.setSeconds(CurrentTime.getSeconds() + remainingSeconds)
      );
      const ETATimeString =
        i < 1
          ? "n.A."
          : ETATime.getHours() +
            ":" +
            ETATime.getMinutes() +
            ":" +
            ETATime.getSeconds();

      // log a line that is overwritten by the next one
      process.stdout.write(
        `[${progressBar}] approx. ${Math.floor(
          (100 * i) / calcOrder.length
        )}% done, time elapsed: ${Math.floor(
          (new Date() - beginTime) / 1000
        )}s - ETA: ${ETATimeString}\r`
      );

      // run femm with lua script
      exec(
        `C:/femm42/bin/femm.exe -lua-script=./calc.lua -windowhide 1>msg.txt 2>&1`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`exec error: ${err}`);
            return;
          }
        }
      );

      let femmStillOpen = true;
      while (femmStillOpen) {
        exec(`tasklist /FI "IMAGENAME eq femm.exe"`, (err, stdout, stderr) => {
          if (err) {
            console.error(`exec error: ${err}`);
            return;
          }
          if (stdout.includes("femm.exe")) {
            femmStillOpen = true;
          } else {
            femmStillOpen = false;
          }
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));

      process.chdir("C:/Users/Robin/Desktop/EM/fullSelfCalculating");

      // copy the result csv files to ./iterations/${parameter}/${value}/
      fs.copyFile(
        `./analysis/F_ump_amp.csv`,
        `./iterations/${parameter}/${value}/F_ump_amp.csv`,
        (err) => {
          if (err) throw err;
        }
      );
      fs.copyFile(
        `./analysis/F_ump_phase.csv`,
        `./iterations/${parameter}/${value}/F_ump_phase.csv`,
        (err) => {
          if (err) throw err;
        }
      );
      fs.copyFile(
        `./analysis/k_e_a.csv`,
        `./iterations/${parameter}/${value}/k_e_a.csv`,
        (err) => {
          if (err) throw err;
        }
      );
      fs.copyFile(
        `./analysis/k_e_LL.csv`,
        `./iterations/${parameter}/${value}/k_e_LL.csv`,
        (err) => {
          if (err) throw err;
        }
      );
      fs.copyFile(
        `./analysis/M_el.csv`,
        `./iterations/${parameter}/${value}/M_el.csv`,
        (err) => {
          if (err) throw err;
        }
      );
      fs.copyFile(
        `./analysis/Psi_a.csv`,
        `./iterations/${parameter}/${value}/Psi_a.csv`,
        (err) => {
          if (err) throw err;
        }
      );

      exec("conda activate copy_to_vis && python copyToVis.py", async (err) => {
        if (err) {
          console.log(err);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // change directory to root
        process.chdir("C:/Users/Robin/Desktop/EM/fullSelfCalculating");

        fs.copyFile(
          `./analysis/Visualisation.xlsx`,
          `./iterations/${parameter}/${value}/Visualisation.xlsx`,
          (err) => {
            if (err) throw err;
          }
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  })
  .then(async () => {
    process.chdir("C:/Users/Robin/Desktop/EM/fullSelfCalculating");
    exec(
      "conda activate copy_to_vis && python generateCombined.py",
      async (err) => {
        if (err) {
          console.log(err);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // change directory to root
        process.chdir("C:/Users/Robin/Desktop/EM/fullSelfCalculating");
      }
    );
  })
  .then(async () => {
    console.log(
      `finished at ${new Date().toLocaleTimeString()} after ${Math.floor(
        (new Date() - beginTime) / 1000
      )}s                                                               `
    );
  });
