/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const validateNpmPackageName = require('validate-npm-package-name');
const { getFromRegistry } = require('./registry');

/**
 * @typedef {object} ParsedReviewRequest
 * @property {string} githubLink GitHub repo link
 * @property {string} npmPackage npm package name
 */

const GITHUB_REPO_LINK_LABEL = 'Link to GitHub repo';
const NPM_PACKAGE_NAME_LABEL = 'Name of NPM package';

/**
 * Parses a "Template Review Request" issue payload.
 *
 * @param {string} githubIssuePayload a "Template Review Request" issue payload
 * @returns {ParsedReviewRequest} An object containing a GitHub repo link and a npm package name.
 */
function parseReviewRequest(githubIssuePayload) {
    const rows = githubIssuePayload.split(/\n/).map(row => row.trim()).filter(row => row != '');
    let githubLink = '';
    let npmPackage = '';
    rows.forEach((row, i) => {
        if (row.includes(GITHUB_REPO_LINK_LABEL)) {
            // the next row should be a GitHub repo link
            githubLink = rows[i + 1];
        } else if (row.includes(NPM_PACKAGE_NAME_LABEL)) {
            // the next row should be a npm package name
            npmPackage = rows[i + 1];
        }
    });
    if (!isValidGithubRepoUrl(githubLink)) {
        throw new Error('A GitHub repo link does not satisfy requirements.');
    }
    if (!isValidNpmPackageName(npmPackage)) {
        throw new Error('A npm package name does not satisfy requirements.');
    }

    return {
        githubLink,
        npmPackage
    };
}

/**
 * Parses a "Template Update Request" issue payload.
 *
 * @param {string} githubIssuePayload a "Template Update Request" issue payload
 * @returns {ParsedReviewRequest} An object containing a GitHub repo link and a npm package name.
 */
function parseUpdateRequest(githubIssuePayload) {
    const rows = githubIssuePayload.split(/\n/).map(row => row.trim()).filter(row => row != '');
    let npmPackage = '';
    rows.forEach((row, i) => {
        if (row.includes(NPM_PACKAGE_NAME_LABEL)) {
            // the next row should be a npm package name
            npmPackage = rows[i + 1];
        }
    });
    if (!isValidNpmPackageName(npmPackage)) {
        throw new Error('A npm package name does not satisfy requirements.');
    }

    const template = getFromRegistry(npmPackage);
    const githubLink = template.links.github;
    return {
        githubLink,
        npmPackage
    };
}

/**
 * Parses a "Template Removal Request" issue payload.
 *
 * @param {string} githubIssuePayload a "Template Removal Request" issue payload
 * @returns {string} a npm package name
 */
function parseRemovalRequest(githubIssuePayload) {
    const rows = githubIssuePayload.split(/\n/).map(row => row.trim()).filter(row => row != '');
    let npmPackage = '';
    rows.forEach((row, i) => {
        if (row.includes(NPM_PACKAGE_NAME_LABEL)) {
            // the next row should be a npm package name
            npmPackage = rows[i + 1];
        }
    });
    if (!isValidNpmPackageName(npmPackage)) {
        throw new Error('A npm package name does not satisfy requirements.');
    }

    return npmPackage;
}

/**
 * Validates if the provided string is a GitHub repo link.
 *
 * @param {string} string A GitHub repo link.
 * @returns {boolean} Returns true is the provided string is a GitHub repo link, false otherwise.
 */
function isValidGithubRepoUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (e) {
        return false;
    }
    let githubRepoUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
    return (githubRepoUrl === string) && (true === githubRepoUrl.startsWith('https://github.com/'));
}

/**
 * Validates if the provided string is a npm package name.
 *
 * @param {string} string a npm package name
 * @returns {boolean} Returns true is the provided string is a npm package name, false otherwise.
 */
function isValidNpmPackageName(string) {
    const res = validateNpmPackageName(string);
    return res.validForNewPackages;
}

module.exports = {
    parseReviewRequest, parseUpdateRequest, parseRemovalRequest
}
