const fs = require("fs");
const genrateLuaContent = require("./functions/genrateLuaContent");
const { exec } = require("child_process");

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

  const calcOrder = JSON.stringify(
    iterate.reduce((acc, curr) => {
      let parameterCalcOrder = [];
      for (let n = curr.beginAt; n <= curr.endAt; n += curr.step) {
        parameterCalcOrder.push(`./iterations/${curr.parameter}/${n}`);
      }
      console.log(acc);
      return [...acc, ...parameterCalcOrder];
    }, []),
    null,
    2
  );

  console.log(calcOrder);

  //save calcOrder to json file
  fs.writeFile(`./calcOrder.json`, calcOrder, (err) => {
    if (err) throw err;
    console.log("calcOrder.json has been saved!");
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));

  if (!fs.existsSync("./iterations")) {
    fs.mkdir("./iterations", (err) => {
      if (err) throw err;
      console.log(`created ./iterations directory`);
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  for (const iteratedParam of iterate) {
    console.log(`\n\nsetting up structure for ${iteratedParam.parameter}: \n`);

    if (!fs.existsSync(`./iterations/${iteratedParam.parameter}`)) {
      fs.mkdir(`./iterations/${iteratedParam.parameter}`, (err) => {
        if (err) throw err;
        console.log(
          `created ./iterations/${iteratedParam.parameter} directory`
        );
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (
      !fs.existsSync(`./iterations/${iteratedParam.parameter}/densityplots`)
    ) {
      fs.mkdir(
        `./iterations/${iteratedParam.parameter}/densityplots`,
        (err) => {
          if (err) throw err;
          console.log(
            `created ./iterations/${iteratedParam.parameter}/densityplots directory`
          );
        }
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    for (
      let n = iteratedParam.beginAt;
      n <= iteratedParam.endAt;
      n += iteratedParam.step
    ) {
      if (!fs.existsSync(`./iterations/${iteratedParam.parameter}/${n}`)) {
        fs.mkdir(`./iterations/${iteratedParam.parameter}/${n}`, (err) => {
          if (err) throw err;
          console.log(
            `created ./iterations/${iteratedParam.parameter}/${n} directory`
          );
        });
      }

      const { parameters } = await readJson();
      parameters[iteratedParam.parameter] = n;

      const luaContent = genrateLuaContent(parameters);
      // wait 0.1 seconds
      await new Promise((resolve) => setTimeout(resolve, 100));
      fs.writeFile(
        `./iterations/${iteratedParam.parameter}/${n}/generatorParams.lua`,
        luaContent,
        (err) => {
          if (err) throw err;
          console.log(
            `Lua file has been saved with ${iteratedParam.parameter} = ${n}!`
          );
        }
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

generateLuaFile()
  .then(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("all subdirectories created!");
  })
  .then(async () => {
    // iterate trough all folders in iterations
    for (const parameter of fs.readdirSync("./iterations")) {
      console.log(`\n\n ${parameter}: \n`);
      for (const value of fs.readdirSync(`./iterations/${parameter}`)) {
        if (value !== "densityplots") {
          console.log(parameter, value);
          // load generatorParams.lua as a string
          const genratorLua = await fs.promises.readFile(
            `./generator.lua`,
            "utf8"
          );

          console.log(`generating template.FEM for ${parameter} = ${value}...`);
          // replace generatorParams.lua with the current iteration
          const genratorLuaWithParams = genratorLua
            .replace(
              /generatorParams.lua/g,
              `./iterations/${parameter}/${value}/generatorParams.lua`
            )
            .replace(
              /template.FEM/g,
              `./iterations/${parameter}/${value}/template.FEM`
            );
          // write the new generatorTemp.lua
          fs.writeFile(`./generatorTemp.lua`, genratorLuaWithParams, (err) => {
            if (err) throw err;
          });
          // open femm
          exec(
            `C:/femm42/bin/femm.exe -lua-script=./generatorTemp.lua`,
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
            exec(
              `tasklist /FI "IMAGENAME eq femm.exe"`,
              (err, stdout, stderr) => {
                if (err) {
                  console.error(`exec error: ${err}`);
                  return;
                }
                if (stdout.includes("femm.exe")) {
                  femmStillOpen = true;
                } else {
                  femmStillOpen = false;
                }
              }
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    }
  })
  .then(async () => {
    for (const parameter of fs.readdirSync("./iterations")) {
      for (const value of fs.readdirSync(`./iterations/${parameter}`)) {
        if (value !== "densityplots") {
          const genratorLua = await fs.promises.readFile(
            `./magFluxPicture.lua`,
            "utf8"
          );
          // replace generatorParams.lua with the current iteration
          const genratorLuaWithParams = genratorLua
            .replace(/root/g, `./iterations/${parameter}`)
            .replace(/parameterValue/g, `${value}`);
          // write the new generatorTemp.lua
          fs.writeFile(
            `./magFluxPictureTemp.lua`,
            genratorLuaWithParams,
            (err) => {
              if (err) throw err;
              console.log("Lua file has been saved!");
            }
          );

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
            exec(
              `tasklist /FI "IMAGENAME eq femm.exe"`,
              (err, stdout, stderr) => {
                if (err) {
                  console.error(`exec error: ${err}`);
                  return;
                }
                if (stdout.includes("femm.exe")) {
                  femmStillOpen = true;
                } else {
                  femmStillOpen = false;
                }
              }
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    }
  });
