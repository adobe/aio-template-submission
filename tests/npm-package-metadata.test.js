const { expect, describe, test } = require('@jest/globals');
const { getNpmPackageMetadata } = require('../src/npm-package-metadata');

describe('Verify grabbing npm package metadata', () => {
    test('Verify that getNpmPackageMetadata() grabs npm package metadata', () => {
        const npmPackageMetadata = getNpmPackageMetadata('tests/templatePackage');
        expect(npmPackageMetadata).toEqual(
            {
                'author': 'Adobe Inc.',
                'name': '@adobe/app-builder-template',
                'description': 'A template for testing purposes [1.0.1]',
                'version': '1.0.1',
                'extension': { 'serviceCode': 'dx/excshell/1' },
                'categories': ['action', 'ui'],
                'services': [
                    {
                        "code": "AnalyticsSDK",
                        "credentials": "OAuth"
                    },
                    {
                        "code": "CampaignStandard"
                    },
                    {
                        "code": "Runtime"
                    }
                ],
                'keywords': ['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template']
            }
        );
    });

    test('Verify that getNpmPackageMetadata() grabs npm package metadata from a template missing optional properties in install.yml', () => {
        const npmPackageMetadata = getNpmPackageMetadata('tests/templatePackageNotImplementingExtensionPoint');
        expect(npmPackageMetadata).toEqual(
            {
                'author': 'Company1 Inc.',
                'name': '@company1/app-builder-template',
                'description': 'A template for testing purposes [1.0.1]',
                'version': '1.0.1',
                'categories': ['action', 'ui'],
                'services': [
                    {
                        "code": "AnalyticsSDK",
                        "credentials": "OAuth"
                    },
                    {
                        "code": "Runtime"
                    }
                ],
                'keywords': ['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template']
            }
        );
        expect(npmPackageMetadata.hasOwnProperty('extension')).toBe(false);
    });
});
