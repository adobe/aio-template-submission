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

jest.mock('@actions/core');

beforeEach(() => {
    jest.clearAllMocks();
});

process.env.ALLOWLIST_ADMINS = 'github-user-1,github-user-2';

describe('Verify invoking is-admin.js', () => {
    test('A user is an admin', () => {
        const userLogin = 'github-user-1';
        const script = '../src/is-admin.js';
        process.argv = ['node', script, userLogin];
        jest.isolateModules(() => {
            require(script);
        });
        expect(core.setOutput).toHaveBeenCalledWith('is-admin', 'true');
    });

    test('A user is not an admin', () => {
        const userLogin = 'non-admin-github-user';
        const script = '../src/is-admin.js';
        process.argv = ['node', script, userLogin];
        jest.isolateModules(() => {
            require(script);
        });
        expect(core.setOutput).toHaveBeenCalledWith('error', ':x: Submitter is not an admin. Admins can remove and update any templates.');
    });
});
