import * as core from "@actions/core";

async function run() {
  try {
    const welcomeInput = core.getInput("who-is-the-welcome-wagon");
    const msg = `Welcome from ${welcomeInput}!`;
    core.debug(msg);
    core.setOutput("message", msg);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

export default run;
