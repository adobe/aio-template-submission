const { Octokit } = require('@octokit/core');
const core = require('@actions/core');
const { getRegistry } = require('./registry');
const failedTemplates = [];

(async function() {
  const [owner, repoName] = process.env.REPO.split('/');
  const registry = getRegistry();
  
  const template = registry[0]; // test only one
  const { id, name } = template;
  const githubLink = template.links.github;
  const npmPackage = name;

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const response = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
      owner: owner,
      repo: repoName,
      workflow_id: 'validate-template-workflow.yml',
      ref: 'main',
      inputs: {
        'github-link': githubLink,
        'npm-package': npmPackage
      }
    });
    const runId = response.data.id;
    core.info(`Workflow run triggered. Run ID: ${runId}.`);
    await waitForWorkflowCompletion(octokit, owner, repoName, runId);
    core.info(`Workflow run completed.`);
  } catch (error) {
    failedTemplates.push({
      id,
      name,
      githubLink,
      npmPackage,
      error: error.message
    });
  }
  core.info(failedTemplates.join(', '));
})();

async function waitForWorkflowCompletion(octokit, owner, repoName, runId) {
  const test = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
    owner: owner,
    repo: repoName,
    run_id: runId
  });

  core.info(test.data);

  let status = 'queued';

  while (status !== 'completed') {
    const runDetails = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
      owner: owner,
      repo: repoName,
      run_id: runId
    });

    status = runDetails.data.status;

    if (status === 'in_progress' || status === 'queued') {
      core.info(`Workflow is still in progress. Waiting...`);
      // Wait for 3 minutes before checking again
      await new Promise(resolve => setTimeout(resolve, 180000));
    }
  }

  core.info(`Workflow run completed with status: ${status}`);
}
