import * as core from '@actions/core';
import fetch from 'node-fetch';
import * as exec from '@actions/exec';
import { getRegistry } from './registry.js';
import * as github from './github.js';

const GITHUB_ISSUES_URL = `https://github.com/${github.GITHUB_REPO_OWNER}/${github.GITHUB_REPO}/issues`;

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
    await fetch(url)
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

        const registry = getRegistry();
        let templatesToRemove = 0;
        let templatesToUpdate = 0;
        for (const template of registry) {
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
                messages.push(`${GITHUB_ISSUES_URL}/${removeIssueNumber} issue created to remove ${templateName}`);
                if (urlAvailability.available !== true) {
                    messages.push(`- ${templateGithubUrl} is not available anymore`);
                    messages.push(`${urlAvailability.error}`);
                }
                if (latestVersionError !== '') {
                    messages.push(`- ${templateName} npm package is not available anymore`);
                    messages.push(`${latestVersionError}`);
                }
                await github.createComment(githubToken, issueNumber, messages.join('\n'));
                messages.push(`\n---\nSee details in ${GITHUB_ISSUES_URL}/${issueNumber}`);
                await github.createComment(githubToken, removeIssueNumber, messages.join('\n'));

                continue;
            }

            if (latestVersion !== templateVersion) {
                templatesToUpdate++;
                const updateIssueNumber = await github.createUpdateIssue(githubToken, templateName, latestVersion, templateGithubUrl);
                let messages = [];
                messages.push(`${GITHUB_ISSUES_URL}/${updateIssueNumber} issue created to update ${templateName}`);
                messages.push(`- There is the newest ${latestVersion} version, the version in Template Registry is ${templateVersion}`);
                await github.createComment(githubToken, issueNumber, messages.join('\n'));
                messages.push(`\n---\nSee details in ${GITHUB_ISSUES_URL}/${issueNumber}`);
                await github.createComment(githubToken, updateIssueNumber, messages.join('\n'));
            }
        }
        core.setOutput('templates-to-process', templatesToRemove + templatesToUpdate);
    } catch (e) {
        core.setOutput('error', `:x: ${e.message}`);
        throw e;
    }
})();
