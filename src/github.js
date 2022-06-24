const github = require('@actions/github');

const GITHUB_LABEL_TEMPLATE_REMOVAL = 'remove-template';
const GITHUB_LABEL_TEMPLATE_UPDATING = 'update-template';
const GITHUB_LABEL_TEMPLATE_AUTO_VERIFICATION = 'template-auto-verification';

/**
 * Create Template Removal issue
 *
 * @param {string} githubToken Github token
 * @param {string} templateName template name
 * @returns {Promise<number>} created issue number
 */
async function createRemoveIssue(githubToken, templateName) {
    const octokit = new github.getOctokit(githubToken);
    const response = await octokit.rest.issues.create({
        'owner': getGithubRepoOwner(),
        'repo': getGithubRepo(),
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
 * @returns {Promise<number>} created issue number
 */
async function createUpdateIssue(githubToken, templateName, templateLatestVersion) {
    const octokit = new github.getOctokit(githubToken);
    const response = await octokit.rest.issues.create({
        'owner': getGithubRepoOwner(),
        'repo': getGithubRepo(),
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
 * @returns {Promise<number>} created comment id
 */
async function createComment(githubToken, issueNumber, comment) {
    const octokit = new github.getOctokit(githubToken);
    const response = await octokit.rest.issues.createComment({
        'owner': getGithubRepoOwner(),
        'repo': getGithubRepo(),
        'issue_number': issueNumber,
        'body': comment
    });
    return response.data.id;
}

/**
 * Returns a Github repo name, for example, "aio-template-submission".
 *
 * @returns {string} A Github repo name
 */
function getGithubRepo() {
    if (!process.env.TR_GITHUB_REPO) {
        throw new Error('TR_GITHUB_REPO env var is not set.')
    }
    return process.env.TR_GITHUB_REPO;
}

/**
 * Returns a Github repo owner, for example, "adobe".
 *
 * @returns {string} A Github repo owner
 */
function getGithubRepoOwner() {
    if (!process.env.TR_GITHUB_REPO_OWNER) {
        throw new Error('TR_GITHUB_REPO_OWNER env var is not set.')
    }
    return process.env.TR_GITHUB_REPO_OWNER;
}

module.exports = {
    getGithubRepo, getGithubRepoOwner, createRemoveIssue, createUpdateIssue, createComment
}
