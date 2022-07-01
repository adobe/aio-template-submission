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

const githubIssueParser = require('../src/githubIssueParser');
const { getFromRegistry } = require('../src/registry');

jest.mock('../src/registry');

const GITHUB_REPO_LINK = 'https://github.com/adobe/app-builder-template';
const NPM_PACKAGE_NAME = '@adobe/app-builder-template';

beforeEach(() => {
    jest.resetAllMocks();
});

describe('Verify parsing Github issues', () => {
    test('Verify parsing "Template Review Request" issue', () => {
        const githubIssuePayload = global.fixtureFile('reviewRequestIssuePayload.txt');
        expect(githubIssueParser.parseReviewRequest(githubIssuePayload)).toEqual({
            'githubLink': GITHUB_REPO_LINK,
            'npmPackage': NPM_PACKAGE_NAME
        });
    });

    test('Verify parsing "Template Review Request" issue, incorrect Github repo Url, case 1', () => {
        const githubIssuePayload = global.fixtureFile('reviewRequestIssuePayloadIncorrectGithubRepoUrl1.txt');
        expect(() => githubIssueParser.parseReviewRequest(githubIssuePayload))
            .toThrowError(new Error(':x: A GitHub repo link does not satisfy requirements.'));
    });

    test('Verify parsing "Template Review Request" issue, incorrect Github repo Url, case 2', () => {
        const githubIssuePayload = global.fixtureFile('reviewRequestIssuePayloadIncorrectGithubRepoUrl2.txt');
        expect(() => githubIssueParser.parseReviewRequest(githubIssuePayload))
            .toThrowError(new Error(':x: A GitHub repo link does not satisfy requirements.'));
    });

    test('Verify parsing "Template Review Request" issue, incorrect npm package name', () => {
        const githubIssuePayload = global.fixtureFile('reviewRequestIssuePayloadIncorrectNpmPackageName.txt');
        expect(() => githubIssueParser.parseReviewRequest(githubIssuePayload))
            .toThrowError(new Error(':x: A npm package name does not satisfy requirements.'));
    });

    test('Verify parsing "Template Update Request" issue', () => {
        const githubIssuePayload = global.fixtureFile('updateRequestIssuePayload.txt');
        getFromRegistry.mockReturnValue({
            'name': NPM_PACKAGE_NAME,
            'links': {
                'github': GITHUB_REPO_LINK
            }
        });
        expect(githubIssueParser.parseUpdateRequest(githubIssuePayload)).toEqual({
            'githubLink': GITHUB_REPO_LINK,
            'npmPackage': NPM_PACKAGE_NAME
        });
        expect(getFromRegistry).toHaveBeenCalledWith(NPM_PACKAGE_NAME);
    });

    test('Verify parsing "Template Update Request" issue, incorrect npm package name', () => {
        const githubIssuePayload = global.fixtureFile('updateRequestIssuePayloadIncorrectNpmPackageName.txt');
        expect(() => githubIssueParser.parseUpdateRequest(githubIssuePayload))
            .toThrowError(new Error(':x: A npm package name does not satisfy requirements.'));
    });

    test('Verify parsing "Template Removal Request" issue', () => {
        const githubIssuePayload = global.fixtureFile('removalRequestIssuePayload.txt');
        expect(githubIssueParser.parseRemovalRequest(githubIssuePayload)).toBe(NPM_PACKAGE_NAME);
    });

    test('Verify parsing "Template Removal Request" issue, incorrect npm package name', () => {
        const githubIssuePayload = global.fixtureFile('removalRequestIssuePayloadIncorrectNpmPackageName.txt');
        expect(() => githubIssueParser.parseRemovalRequest(githubIssuePayload))
            .toThrowError(new Error(':x: A npm package name does not satisfy requirements.'));
    });
});
