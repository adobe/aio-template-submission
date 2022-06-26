const github = require('@actions/github');

const GITHUB_LABEL_TEMPLATE_REMOVAL = 'remove-template';
const GITHUB_LABEL_TEMPLATE_UPDATING = 'update-template';
const GITHUB_LABEL_TEMPLATE_AUTO_VERIFICATION = 'template-auto-verification';

/**
 * Create Template Removal issue
 *
 * @param {string} githubToken Github token
 * @param {string} templateName template name
 * @param {string} githubRepoOwner a Github repo owner, for example, "adobe"
 * @param {string} githubRepo a Github repo name, for example, "aio-template-submission"
 * @returns {Promise<number>} created issue number
 */
async function createRemoveIssue(githubToken, templateName, githubRepoOwner, githubRepo) {
    const octokit = new github.getOctokit(githubToken);
    const response = await octokit.rest.issues.create({
        'owner': githubRepoOwner,
        'repo': githubRepo,
        'title': `Remove ${templateName} as npm/github links are not valid anymore`,
        'labels': [GITHUB_LABEL_TEMPLATE_REMOVAL, GITHUB_LABEL_TEMPLATE_AUTO_VERIFICATION],
        'body': `### "Name of NPM package"\n${templateName}`
    });
    return response.data.number;
}

/**
 * Create Template Updating issue
 *
 * @param {string} githubToken Github token
 * @param {string} templateName template name
 * @param {string} templateLatestVersion template latest version
 * @param {string} githubRepoOwner a Github repo owner, for example, "adobe"
 * @param {string} githubRepo a Github repo name, for example, "aio-template-submission"
 * @returns {Promise<number>} created issue number
 */
async function createUpdateIssue(githubToken, templateName, templateLatestVersion, githubRepoOwner, githubRepo) {
    const octokit = new github.getOctokit(githubToken);
    const response = await octokit.rest.issues.create({
        'owner': githubRepoOwner,
        'repo': githubRepo,
        'title': `Update ${templateName} as there is the newest ${templateLatestVersion} version`,
        'labels': [GITHUB_LABEL_TEMPLATE_UPDATING, GITHUB_LABEL_TEMPLATE_AUTO_VERIFICATION],
        'body': `### "Name of NPM package"\n${templateName}`
    });
    return response.data.number;
}

/**
 * Add comment to issue
 *
 * @param {string} githubToken Github token
 * @param {number} issueNumber issue number
 * @param {string} comment comment to add
 * @param {string} githubRepoOwner a Github repo owner, for example, "adobe"
 * @param {string} githubRepo a Github repo name, for example, "aio-template-submission"
 * @returns {Promise<number>} created comment id
 */
async function createComment(githubToken, issueNumber, comment, githubRepoOwner, githubRepo) {
    const octokit = new github.getOctokit(githubToken);
    const response = await octokit.rest.issues.createComment({
        'owner': githubRepoOwner,
        'repo': githubRepo,
        'issue_number': issueNumber,
        'body': comment
    });
    return response.data.id;
}

module.exports = {
    createRemoveIssue, createUpdateIssue, createComment
}
