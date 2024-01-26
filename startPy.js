const { spawn } = require("child_process");

let command = "conda activate copy_to_vis && python copyToVis.py";

// wait for the process to finish then console.log ('success')
const { exec } = require("child_process");

const copyRsults = async () => {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};
