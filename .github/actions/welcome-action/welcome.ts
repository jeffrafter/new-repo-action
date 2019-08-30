import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const welcomeInput = core.getInput("who-is-the-welcome-wagon");
    const msg = `Welcome from ${welcomeInput}!`;
    core.debug(msg);
    core.setOutput("message", msg);

    // https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret
    const client: github.GitHub = new github.GitHub(
      process.env["GITHUB_TOKEN"] || ""
    );

    const nwo = process.env["GITHUB_REPOSITORY"] || "/";
    const [owner, repo] = nwo.split("/");
    const suffix = "-2";
    const branchName = `submission${suffix}`;
    const ref = `refs/heads/${branchName}`;
    const sha = process.env["GITHUB_SHA"] || "";

    let branch: any = null;

    try {
      branch = await client.git.getRef({
        owner,
        repo,
        ref
      });
    } catch {
      // No-op, not found
    }
    if (branch) {
      throw new Error(`Branch ${ref} already exists`);
    }

    // https://octokit.github.io/rest.js/#octokit-routes-issues
    await client.issues.create({
      owner: owner,
      repo: repo,
      title: "Welcome" + suffix,
      body: "Thanks for using this template. To get started..."
    });

    // Create a branch submission
    // https://octokit.github.io/rest.js/#octokit-routes-git-create-ref
    await client.git.createRef({
      owner,
      repo,
      ref,
      sha
    });

    // Protect that branch
    // https://octokit.github.io/rest.js/#octokit-routes-repos-update-branch-protection
    // await client.repos.updateBranchProtection({
    //   owner: owner,
    //   repo: repo,
    //   branch: branchName,
    //   required_status_checks: null,
    //   enforce_admins: true,
    //   required_pull_request_reviews: null,
    //   restrictions: null
    // });

    // Create a pull request from master to that branch
    // https://octokit.github.io/rest.js/#octokit-routes-pulls
    // Could be a draft, then marking ready-for-review marks as submitted
    await client.pulls.create({
      owner,
      repo,
      title: "Submission" + suffix,
      body: "This is the submission",
      head: "ref/heads/master", // master is what the is committed to
      base: ref // The submission branch is the base
    });
  } catch (error) {
    core.setFailed(error.message + "\n\n" + error.stack);
  }
}

run();

export default run;
