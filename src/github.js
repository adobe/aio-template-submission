import * as github from '@actions/github';

export const GITHUB_REPO = 'aio-template-submission';
export const GITHUB_REPO_OWNER = 'adobe';
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
export async function createRemoveIssue(githubToken, templateName) {
    const octokit = new github.getOctokit(githubToken);
    const response = await octokit.rest.issues.create({
        'owner': GITHUB_REPO_OWNER,
        'repo': GITHUB_REPO,
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
 * @param {string} templateGithubUrl template Github repo url
 * @returns {Promise<number>} created issue number
 */
export async function createUpdateIssue(githubToken, templateName, templateLatestVersion, templateGithubUrl) {
    const octokit = new github.getOctokit(githubToken);
    const response = await octokit.rest.issues.create({
        'owner': GITHUB_REPO_OWNER,
        'repo': GITHUB_REPO,
        'title': `Update ${templateName} as there is the newest ${templateLatestVersion} version`,
        'labels': [GITHUB_LABEL_TEMPLATE_UPDATING, GITHUB_LABEL_TEMPLATE_AUTO_VERIFICATION],
        'body': `### "Link to GitHub repo"\n${templateGithubUrl}\n### "Name of NPM package"\n${templateName}`
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
export async function createComment(githubToken, issueNumber, comment) {
    const octokit = new github.getOctokit(githubToken);
    const response = await octokit.rest.issues.createComment({
        'owner': GITHUB_REPO_OWNER,
        'repo': GITHUB_REPO,
        'issue_number': issueNumber,
        'body': comment
    });
    return response.data.id;
}
