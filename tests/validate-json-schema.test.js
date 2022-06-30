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
const core = require('@actions/core');
const validateJson = require('../src/validate-json-schema');
const { generateRegistryItem } = require('./helper');

jest.mock('@actions/core');

describe('Verify "Template Registry" JSON Schema validation', () => {
    test('Verify valid json payload', () => {
        let registryItems = [];
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-1'));
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-2'));

        expect(validateJson(JSON.stringify(registryItems, null, 4))).toBeUndefined();
        expect(core.setOutput).not.toHaveBeenCalled();
    });

    test('Verify that validateJson() throws exception for invalid json payload', () => {
        let registryItems = [];
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-1'));
        let registryItem = generateRegistryItem('@adobe/app-builder-template-2');
        delete registryItem.name;
        registryItems.push(registryItem);

        expect(() => validateJson(JSON.stringify(registryItems, null, 4)))
            .toThrowError();
        expect(core.setOutput).toHaveBeenCalledWith('error', ':warning: Attempt to save invalid data to the registry. See `registry.schema.json` for more details.');
    });
});
