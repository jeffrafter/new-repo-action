import * as core from "@actions/core";

async function run() {
  try {
    const helloInput = core.getInput("hello");
    const msg = `Hello from ${helloInput}!`;
    core.debug(msg);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

export default run;
