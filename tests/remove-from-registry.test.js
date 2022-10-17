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
const { when } = require('jest-when');
const { generateRegistryItem, getRegistryJsonSchema } = require('./helper');
const fs = require('fs');

jest.mock('fs', () => ({
    promises: {
      access: jest.fn()
    },
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
  }));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Verify template removal action', () => {
    test('Verify that "remove-from-registry.js" removes template', () => {
        let registryItem1 = generateRegistryItem('@adobe/app-builder-template-1');
        const templateName = '@adobe/app-builder-template-2';
        let registryItem2 = generateRegistryItem(templateName);
        let registryItems = [registryItem1, registryItem2];
        when(fs.readFileSync).calledWith('registry.schema.json').mockReturnValue(getRegistryJsonSchema());
        when(fs.readFileSync).calledWith('registry.json').mockReturnValue(JSON.stringify(registryItems, null, 4));

        const script = '../src/remove-from-registry.js';
        process.argv = ['node', script, templateName];
        jest.isolateModules(() => {
            require(script);
        });

        let newRegistryItems = [registryItem1];
        expect(fs.writeFileSync).toHaveBeenCalledWith('registry.json', JSON.stringify(newRegistryItems, null, 4));
    });
});
