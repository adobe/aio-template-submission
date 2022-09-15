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

const { expect, describe, test } = require('@jest/globals');
const { getTemplateGithubIssues } = require('../src/get-matching-open-issue');
const core = require('@actions/core');
jest.mock('@actions/core');
jest.mock('../src/get-matching-open-issue');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Check if matching open issue for template exists', () => {
    test('Matching open issue exists', async () => {
        const label = 'update-template';
        const npmPackage = '@ajzhao32423423894/app-builder-template';
        const githubRepoOwner = 'adobe'
        const githubRepo = 'aio-template-submission'
        const result = {
          "html_url": "https://github.com/devx-services/aio-template-submission/issues/83",
          "number": 83
        }
        getTemplateGithubIssues.mockReturnValue(result)
        const script = '../src/check-matching-open-issue.js';
        process.argv = ['node', script, label, npmPackage, githubRepoOwner, githubRepo];
        jest.isolateModules(async () => {
            await require(script);
        });
        expect(core.setOutput).toHaveBeenCalledWith('issue-number', 83);
    });

    test('No matching open issue exists', async () => {
        const label = 'update-template';
        const npmPackage = '@ajzhao32423423894/app-builder-template';
        const githubRepoOwner = 'adobe'
        const githubRepo = 'aio-template-submission'
        const result = {}
        const consoleSpy = jest.spyOn(console, 'log');
        getTemplateGithubIssues.mockReturnValue(result)
        const script = '../src/check-matching-open-issue.js';
        process.argv = ['node', script, label, npmPackage, githubRepoOwner, githubRepo];
        jest.isolateModules(async () => {
            await require(script);
        });
        expect(consoleSpy).toHaveBeenCalledWith('No open Github issue for approved template found');
    });
});
