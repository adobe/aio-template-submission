const { Octokit } = require('@octokit/core');
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
    console.log(`Workflow run triggered. Waiting for completion...`);
    await waitForWorkflowCompletion(octokit, owner, repoName, runId);
    console.log(`Workflow run completed.`);
  } catch (error) {
    failedTemplates.push({
      id,
      name,
      githubLink,
      npmPackage,
      error: error.message
    });
  }
  console.log(failedTemplates.join(', '));
})();

async function waitForWorkflowCompletion(octokit, owner, repoName, runId) {
  let status = 'in_progress';

  while (status === 'in_progress') {
    const runDetails = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
      owner: owner,
      repo: repoName,
      run_id: runId
    });

    status = runDetails.data.status;

    if (status === 'in_progress') {
      console.log(`Workflow is still in progress. Waiting...`);
      // Wait for 3 minutes before checking again
      await new Promise(resolve => setTimeout(resolve, 180000));
    }
  }

  console.log(`Workflow run completed with status: ${status}`);
}