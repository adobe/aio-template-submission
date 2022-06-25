const core = require('@actions/core');
const axios = require('axios').default;
const exec = require('@actions/exec');
const { getRegistry, TEMPLATE_STATUS_IN_VERIFICATION } = require('./registry');
const github = require('./github');

/**
 * Get the latest template version
 *
 * @param {string} templateName template name
 * @returns {Promise<string>}
 */
async function getLatestVersion(templateName) {
    let output = '';
    let error = '';
    const options = {
        listeners: {
            stdout: data => output += data.toString(),
            stderr: data => error += data.toString()
        },
        ignoreReturnCode: true,
        silent: true
    }
    let result = await exec.exec('npm', ['view', templateName, 'version', '--json'], options);
    if (result !== 0) {
        let errorMsg = `Error fetching the latest version of ${templateName}\n`;
        errorMsg += `"npm view ${templateName} version --json" command failed\n\n`;
        errorMsg += error;
        throw new Error(errorMsg);
    }
    return JSON.parse(output);
}

/**
 * Check Url availability
 *
 * @param {string} url Url link
 * @returns {Promise<{available: boolean, error: string}>}
 */
async function checkUrlAvailability(url) {
    let result = {
        available: false,
        error: ''
    }
    await axios({
        'method': 'get',
        'url': url
    })
        .then(response => {
            if (response.status === 200) {
                result.available = true;
            } else {
                result.error = `Error fetching "${url}". Response code is ${response.status}`;
            }
        })
        .catch(e => {
            result.error = `Error occurred during fetching "${url}". ${e.message}`;
        });
    return result;
}

(async () => {
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        const myArgs = process.argv.slice(2);
        const issueNumber = myArgs[0];
        const githubRepoOwner = myArgs[1];
        const githubRepo = myArgs[2];
        const githubIssuesUrl = `https://github.com/${githubRepoOwner}/${githubRepo}/issues`;

        const registry = getRegistry();
        let templatesToRemove = 0;
        let templatesToUpdate = 0;
        for (const template of registry) {
            if (template.status === TEMPLATE_STATUS_IN_VERIFICATION) {
                continue;
            }
            const templateName = template.name;
            const templateGithubUrl = template.links.github;
            const templateVersion = template.latestVersion;

            let urlAvailability = await checkUrlAvailability(templateGithubUrl);
            let latestVersion;
            let latestVersionError = '';
            try {
                latestVersion = await getLatestVersion(templateName);
            } catch (e) {
                latestVersionError = e.message;
            }

            if (urlAvailability.available !== true || latestVersionError !== '') {
                templatesToRemove++;
                const removeIssueNumber = await github.createRemoveIssue(githubToken, templateName);
                let messages = [];
                messages.push(`${githubIssuesUrl}/${removeIssueNumber} issue created to remove ${templateName}`);
                if (urlAvailability.available !== true) {
                    messages.push(`- ${templateGithubUrl} is not available anymore`);
                    messages.push(`${urlAvailability.error}`);
                }
                if (latestVersionError !== '') {
                    messages.push(`- ${templateName} npm package is not available anymore`);
                    messages.push(`${latestVersionError}`);
                }
                await github.createComment(githubToken, issueNumber, messages.join('\n'));
                messages.push(`\n---\nSee details in ${githubIssuesUrl}/${issueNumber}`);
                await github.createComment(githubToken, removeIssueNumber, messages.join('\n'));

                continue;
            }

            if (latestVersion !== templateVersion) {
                templatesToUpdate++;
                const updateIssueNumber = await github.createUpdateIssue(githubToken, templateName, latestVersion);
                let messages = [];
                messages.push(`${githubIssuesUrl}/${updateIssueNumber} issue created to update ${templateName}`);
                messages.push(`- There is the newest ${latestVersion} version, the version in Template Registry is ${templateVersion}`);
                await github.createComment(githubToken, issueNumber, messages.join('\n'));
                messages.push(`\n---\nSee details in ${githubIssuesUrl}/${issueNumber}`);
                await github.createComment(githubToken, updateIssueNumber, messages.join('\n'));
            }
        }
        core.setOutput('templates-to-process', templatesToRemove + templatesToUpdate);
    } catch (e) {
        core.setOutput('error', `:x: ${e.message}`);
        throw e;
    }
})();
