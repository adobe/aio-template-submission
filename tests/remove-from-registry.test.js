const { expect, describe, test } = require('@jest/globals');
const { when } = require('jest-when');
const { generateRegistryItem, getRegistryJsonSchema } = require('./helper');
const fs = require('fs');

jest.mock('fs');

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
