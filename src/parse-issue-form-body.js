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

const core = require('@actions/core');
const githubIssueParser = require('./githubIssueParser');

try {
    const githubIssuePayload = process.env.GITHUB_ISSUE_PAYLOAD;
    const args = process.argv.slice(2);
    const issueType = args[0];

    switch (issueType) {
        case 'review-request': {
            const { githubLink, npmPackage } = githubIssueParser.parseReviewRequest(githubIssuePayload);
            core.setOutput('github-link', githubLink);
            core.setOutput('npm-package', npmPackage);
            break;
        }
        case 'update-request': {
            const { githubLink, npmPackage } = githubIssueParser.parseUpdateRequest(githubIssuePayload);
            core.setOutput('github-link', githubLink);
            core.setOutput('npm-package', npmPackage);
            break;
        }
        case 'removal-request': {
            const npmPackage = githubIssueParser.parseRemovalRequest(githubIssuePayload);
            core.setOutput('npm-package', npmPackage);
            break;
        }
        default:
            throw new Error(':x: Unknown Issue Type.');
    }
} catch (e) {
    core.setOutput('error', e.message);
    throw e;
}
