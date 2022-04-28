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
                'extensions': ['dx/excshell/1'],
                'categories': ['extension'],
                'services': ['AnalyticsSDK', 'CampaignStandard', 'Runtime'],
                'keywords': ['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template']
            }
        );
    });
});
