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

const { expect, describe, test, beforeEach } = require('@jest/globals');
const { getTemplateGithubIssues } = require('../src/get-matching-open-issue');

const nock = require('nock');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Get matching open issue of approved template', () => {

    test('Successfully get matching open issue', async () => {
        const response = [{
          "body": "### npm package name\n\n@ajzhao32423423894/app-builder-template",
          "html_url": "https://github.com/devx-services/aio-template-submission/issues/81",
          "number": 81
        },
        {
          "body": "### npm package name\n\n@adobe/template-1",
          "html_url": "https://github.com/devx-services/aio-template-submission/issues/81",
          "number": 83
        },
        {
          "body": "### npm package name\n\n@adobe/template-2",
          "html_url": "https://github.com/devx-services/aio-template-submission/issues/81",
          "number": 84
        }]
        const label = 'update-template';
        const npmPackage = '@ajzhao32423423894/app-builder-template';
        const githubRepoOwner = 'adobe'
        const githubRepo = 'aio-template-submission'
        nock('https://api.github.com')
          .get(`/repos/${githubRepoOwner}/${githubRepo}/issues?state=open&labels=${label}`)
          .times(1)
          .reply(200, response);
        await expect(getTemplateGithubIssues(label, npmPackage, githubRepoOwner, githubRepo))
            .resolves.toStrictEqual(response[0]);
    });
  test('No matching open issue', async () => {
    const response = [{
      "body": "### npm package name\n\n@ajzhao32423423894/app-builder-template",
      "html_url": "https://github.com/devx-services/aio-template-submission/issues/81",
      "number": 81
    },
    {
      "body": "### npm package name\n\n@adobe/template-1",
      "html_url": "https://github.com/devx-services/aio-template-submission/issues/81",
      "number": 83
    },
    {
      "body": "### npm package name\n\n@adobe/template-2",
      "html_url": "https://github.com/devx-services/aio-template-submission/issues/81",
      "number": 84
    }]
    const label = 'update-template';
    const npmPackage = '@adobe/template-3';
    const githubRepoOwner = 'adobe'
    const githubRepo = 'aio-template-submission'
    nock('https://api.github.com')
      .get(`/repos/${githubRepoOwner}/${githubRepo}/issues?state=open&labels=${label}`)
      .times(1)
      .reply(200, response);
    await expect(getTemplateGithubIssues(label, npmPackage, githubRepoOwner, githubRepo))
        .resolves.toStrictEqual({});
  });

  test('No open issues', async () => {
    const label = 'update-template';
    const npmPackage = '@adobe/template-3';
    const githubRepoOwner = 'adobe'
    const githubRepo = 'aio-template-submission'
    nock('https://api.github.com')
      .get(`/repos/${githubRepoOwner}/${githubRepo}/issues?state=open&labels=${label}`)
      .times(1)
      .reply(200, []);
    await expect(getTemplateGithubIssues(label, npmPackage, githubRepoOwner, githubRepo))
        .resolves.toStrictEqual({});
  });

  test('Error handling', async () => {
    const label = 'update-template';
    const npmPackage = '@adobe/template-3';
    const githubRepoOwner = 'adobe'
    const githubRepo = 'aio-template-submission'
    nock('https://api.github.com')
      .get(`/repos/${githubRepoOwner}/${githubRepo}/issues?state=open&labels=${label}`)
      .times(1)
      .reply(404);
    await expect(getTemplateGithubIssues(label, npmPackage, githubRepoOwner, githubRepo))
        .resolves.toHaveProperty("status", 404)
  });
});