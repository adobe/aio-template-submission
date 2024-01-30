const { Octokit } = require('@octokit/core');
const { getRegistry } = require('./registry');
const failedTemplates = [];

(async function() {
  const registry = getRegistry();
  const template = registry[0]; // test only one
  const { id, name } = template;
  const githubLink = template.links.github;
  const npmPackage = name;

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
      owner: '${{ github.repository_owner }}',
      repo: '${{ github.repository }}',
      workflow_id: 'validate-template-workflow.yml',
      ref: 'main',
      inputs: {
        'github-link': githubLink,
        'npm-package': npmPackage
      }
    });
  } catch (error) {
    failedTemplates.push({
      id,
      githubLink,
      npmPackage,
      error: error.message
    });
  }
  console.log(failedTemplates);
})();
