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
const githubIssueParser = require('../src/githubIssueParser');

jest.mock('../src/githubIssueParser');
jest.mock('@actions/core');

const githubLink = 'some-github-link';
const npmPackage = 'some-npm-package';
const issuePayload = 'some-issue-payload';
process.env.GITHUB_ISSUE_PAYLOAD = issuePayload;

beforeEach(() => {
    jest.resetAllMocks();
});

describe('Verify invoking parse-issue-form-body.js', () => {
    test('Verify that parse-issue-form-body.js parses "Review Request"', () => {
        const issueType = 'review-request';
        githubIssueParser.parseReviewRequest.mockReturnValue({
            'githubLink': githubLink,
            'npmPackage': npmPackage
        });
        const script = '../src/parse-issue-form-body.js';
        process.argv = ['node', script, issueType];
        jest.isolateModules(() => {
            require(script);
        });
        expect(githubIssueParser.parseReviewRequest).toHaveBeenCalledWith(issuePayload);
        expect(core.setOutput).toHaveBeenCalledWith('github-link', githubLink);
        expect(core.setOutput).toHaveBeenCalledWith('npm-package', npmPackage);
    });

    test('Verify that parse-issue-form-body.js parses "Update Request"', () => {
        const issueType = 'update-request';
        githubIssueParser.parseUpdateRequest.mockReturnValue({
            'githubLink': githubLink,
            'npmPackage': npmPackage
        });
        const script = '../src/parse-issue-form-body.js';
        process.argv = ['node', script, issueType];
        jest.isolateModules(() => {
            require(script);
        });
        expect(githubIssueParser.parseUpdateRequest).toHaveBeenCalledWith(issuePayload);
        expect(core.setOutput).toHaveBeenCalledWith('github-link', githubLink);
        expect(core.setOutput).toHaveBeenCalledWith('npm-package', npmPackage);
    });

    test('Verify that parse-issue-form-body.js parses "Removal Request"', () => {
        const issueType = 'removal-request';
        githubIssueParser.parseRemovalRequest.mockReturnValue(npmPackage);
        const script = '../src/parse-issue-form-body.js';
        process.argv = ['node', script, issueType];
        jest.isolateModules(() => {
            require(script);
        });
        expect(githubIssueParser.parseRemovalRequest).toHaveBeenCalledWith(issuePayload);
        expect(core.setOutput).toHaveBeenCalledWith('npm-package', npmPackage);
    });

    test('Verify that parse-issue-form-body.js does not process unknown issue types', () => {
        const issueType = 'unknown-request';
        const script = '../src/parse-issue-form-body.js';
        process.argv = ['node', script, issueType];
        jest.isolateModules(() => {
            try {
                require(script);
            } catch (e) {
                // an exception should be thrown, we check that it was caught by checking `core.setOutput` arguments below
            }
        });
        expect(core.setOutput).toHaveBeenCalledWith('error', ':x: Unknown Issue Type.');
    });
});
