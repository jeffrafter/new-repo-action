import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const welcomeInput = core.getInput("who-is-the-welcome-wagon");
    const msg = `Welcome from ${welcomeInput}!`;
    core.debug(msg);
    core.setOutput("message", msg);

    // const issue: { owner: string; repo: string; number: number } =
    //   github.context.issue;
    // if (github.context.payload.action !== "opened") {
    //   console.log("No issue or pull request was opened, skipping");
    //   return;
    // }

    // https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret
    const client: github.GitHub = new github.GitHub(
      process.env["GITHUB_TOKEN"] || ""
    );

    const nwo = process.env["GITHUB_REPOSITORY"] || "/";
    const [owner, repo] = nwo.split("/");

    // https://octokit.github.io/rest.js/#octokit-routes-issues
    await client.issues.create({
      owner: owner,
      repo: repo,
      title: "Welcome",
      body: "Thanks for using this template. To get started..."
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

export default run;
