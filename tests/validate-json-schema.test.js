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
