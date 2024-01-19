const fs = require("fs");
const genrateLuaContent = require("./functions/genrateLuaContent");
const { exec } = require("child_process");

const readJson = async () => {
  try {
    const jsonString = await fs.promises.readFile("./iterate.json", "utf8");
    const { parameters, iterate } = JSON.parse(jsonString);
    return { parameters, iterate };
  } catch (err) {
    console.log("Error reading file from disk or parsing JSON string:", err);
  }
};

const generateLuaFile = async () => {
  const { parameters, iterate } = await readJson();
  if (!fs.existsSync("./iterations")) {
    fs.mkdir("./iterations", (err) => {
      if (err) throw err;
      console.log("Directory created");
    });
  }

  if (!fs.existsSync(`./iterations/${iterate.parameter}/densityplots`)) {
    fs.mkdir(`./iterations/${iterate.parameter}/densityplots`, (err) => {
      if (err) throw err;
      console.log("Directory created");
    });
  }

  if (!fs.existsSync(`./iterations/${iterate.parameter}`)) {
    fs.mkdir(`./iterations/${iterate.parameter}`, (err) => {
      if (err) throw err;
      console.log("Directory created");
    });
  }
  console.log(iterate);
  for (let n = iterate.beginAt; n <= iterate.endAt; n += iterate.step) {
    if (!fs.existsSync(`./iterations/${iterate.parameter}/${n}`)) {
      fs.mkdir(`./iterations/${iterate.parameter}/${n}`, (err) => {
        if (err) throw err;
      });
    }
    parameters[iterate.parameter] = n;
    const luaContent = genrateLuaContent(parameters);
    // wait 0.1 seconds
    await new Promise((resolve) => setTimeout(resolve, 100));
    fs.writeFile(
      `./iterations/${iterate.parameter}/${n}/generatorParams.lua`,
      luaContent,
      (err) => {
        if (err) throw err;
        console.log(
          `Lua file has been saved with ${iterate.parameter} = ${n}!`
        );
      }
    );
  }
};

generateLuaFile()
  .then(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log("Done!");
  })
  .then(async () => {
    // iterate trough all folders in iterations
    for (const parameter of fs.readdirSync("./iterations")) {
      for (const value of fs.readdirSync(`./iterations/${parameter}`)) {
        if (value !== "densityplots") {
          console.log(parameter, value);
          // load generatorParams.lua as a string
          const genratorLua = await fs.promises.readFile(
            `./generator.lua`,
            "utf8"
          );
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
            console.log("Lua file has been saved!");
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
