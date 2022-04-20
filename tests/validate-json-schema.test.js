const { expect, describe, test } = require('@jest/globals');
const { v4: uuidv4 } = require('uuid');
const core = require('@actions/core');
const validateJson = require('../src/validate-json-schema');

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
        delete registryItem.description;
        registryItems.push(registryItem);

        expect(() => validateJson(JSON.stringify(registryItems, null, 4)))
            .toThrowError();
        expect(core.setOutput).toHaveBeenCalledWith('error', ':warning: Attempt to save invalid data to the registry. See `registry.schema.json` for more details.');
    });
});

function generateRegistryItem(templateName) {
    const registryItem = {
        'id': uuidv4(),
        'author': 'Adobe Inc.',
        'name': templateName,
        'description': 'A template for testing purposes',
        'latestVersion': '1.0.1',
        'publishDate': (new Date(Date.now())).toISOString(),
        'extensions': [
            'dx/excshell/1'
        ],
        'categories': [
            'add-action'
        ],
        'services': [
            'AnalyticsSDK',
            'CampaignStandard',
            'Runtime'
        ],
        'adobeRecommended': true,
        'keywords': [
            'aio',
            'adobeio',
            'aio-app-builder-template'
        ],
        'links': {
            'npm': `https://www.npmjs.com/package/${templateName}`,
            'github': `https://github.com/${templateName}`
        }
    }
    return registryItem;
}
