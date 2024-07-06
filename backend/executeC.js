const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`); // Use .exe for Windows

  return new Promise((resolve, reject) => {
    const compileCommand = `gcc "${filepath}" -o "${outPath}"`;
    const runCommand = `"${outPath}" < "${inputPath}"`;

    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        return reject({ error: compileError, stderr: compileStderr });
      }
      exec(runCommand, (runError, runStdout, runStderr) => {
        if (runError) {
          return reject({ error: runError, stderr: runStderr });
        }
        if (runStderr) {
          return reject(runStderr);
        }
        resolve(runStdout);
      });
    });
  });
};

module.exports = {
  executeC,
};
