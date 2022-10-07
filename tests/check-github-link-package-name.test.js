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

const fetch = require('node-fetch');

jest.mock('node-fetch');

const createMockResponse = _json => {
    return {
        json: async () => _json
    }
}

describe('Verify checking Github repo `package.json:name`', () => {
    test('Verify that Github repo has correct `package.json:name`', () => {
        const npmPackageName = '@adobe/template';
        const githubLink = 'https://github.com/adobe/template';

        const defaultBranch = 'main';
        const defaultBranchJson = {
            default_branch: defaultBranch
        }
        fetch.mockResolvedValueOnce(createMockResponse(defaultBranchJson));
        const githubPackageJson = {
            name: npmPackageName
        }
        fetch.mockResolvedValueOnce(createMockResponse(githubPackageJson));
        const script = '../src/check-github-link-package-name.js';
        process.argv = ['node', script, npmPackageName, githubLink];
        jest.isolateModules(async () => {
            require(script);
        });
    });

    test('Verify that error message set if Github repo has incorrect `package.json:name`', () => {
        const npmPackageName = '@adobe/template';
        const githubLink = 'https://github.com/adobe/template';

        const defaultBranch = 'main';
        const defaultBranchJson = {
            default_branch: defaultBranch
        }
        fetch.mockResolvedValueOnce(createMockResponse(defaultBranchJson));
        const githubPackageJson = {
            name: 'some-name-not-equal-to-expected-package-name'
        }
        fetch.mockResolvedValueOnce(createMockResponse(githubPackageJson));
        const script = '../src/check-github-link-package-name.js';
        process.argv = ['node', script, npmPackageName, githubLink];
        jest.isolateModules(async () => {
            require(script);
        });
    });
});
