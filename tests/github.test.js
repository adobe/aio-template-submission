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
const nock = require('nock');
const github = require('../src/github');

const GITHUB_TOKEN = 'github_token';
const TEMPLATE_NAME = '@test/app-builder-template';
const TEMPLATE_LATEST_VERSION = '1.0.1';
const ISSUE_NUMBER = 1001;

const GITHUB_REPO_OWNER = 'adobe';
const GITHUB_REPO = 'aio-template-submission';

describe('Verify creation of Github issues and comments', () => {
    test('Verify that "Template Removal Request" issue created', async () => {
        nock('https://api.github.com')
            .post('/repos/adobe/aio-template-submission/issues', {
                'title': `Remove ${TEMPLATE_NAME} as npm/github links are not valid anymore`,
                'labels': ['remove-template', 'template-auto-verification'],
                'body': `### npm package name\n${TEMPLATE_NAME}`
            })
            .times(1)
            .reply(200, { 'number': ISSUE_NUMBER });

        await expect(github.createRemoveIssue(GITHUB_TOKEN, TEMPLATE_NAME, GITHUB_REPO_OWNER, GITHUB_REPO))
            .resolves.toBe(ISSUE_NUMBER);
    });

    test('Verify that "Template Update Request" issue created', async () => {
        nock('https://api.github.com')
            .post('/repos/adobe/aio-template-submission/issues', {
                'title': `Update ${TEMPLATE_NAME} as there is the newest ${TEMPLATE_LATEST_VERSION} version`,
                'labels': ['update-template', 'template-auto-verification'],
                'body': `### npm package name\n${TEMPLATE_NAME}`
            })
            .times(1)
            .reply(200, { 'number': ISSUE_NUMBER });

        await expect(github.createUpdateIssue(GITHUB_TOKEN, TEMPLATE_NAME, TEMPLATE_LATEST_VERSION, GITHUB_REPO_OWNER, GITHUB_REPO))
            .resolves.toBe(ISSUE_NUMBER);
    });

    test('Verify that comment to Github issue added', async () => {
        const comment = 'Hello World!';
        const commentId = 100001;
        nock('https://api.github.com')
            .post(`/repos/adobe/aio-template-submission/issues/${ISSUE_NUMBER}/comments`, {
                'body': comment
            })
            .times(1)
            .reply(200, { 'id': commentId });

        await expect(github.createComment(GITHUB_TOKEN, ISSUE_NUMBER, comment, GITHUB_REPO_OWNER, GITHUB_REPO))
            .resolves.toBe(commentId);
    });
});
