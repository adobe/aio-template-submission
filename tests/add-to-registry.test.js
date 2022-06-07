const { expect, describe, test } = require('@jest/globals');
const { generateRegistryItem } = require('./helper');
const { isAdobeRecommended } = require('../src/is-adobe-recommended');
const { isInRegistry, addToRegistry, getFromRegistry, updateInRegistry, TEMPLATE_STATUS_IN_VERIFICATION, TEMPLATE_STATUS_APPROVED }
    = require('../src/registry');

jest.mock('../src/is-adobe-recommended');
jest.mock('../src/registry');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Verify adding template to registry', () => {
    test('Verify that "add-to-registry.js" adds template', async () => {
        const gitHubUrl = 'https://github.com/adobe/app-builder-template';
        const npmPackageName = '@adobe/app-builder-template';
        const adobeRecommended = false;
        isAdobeRecommended.mockReturnValue(adobeRecommended);
        isInRegistry.mockReturnValue(false);
        addToRegistry.mockImplementation((item) => {
            expect(typeof item.id === 'string').toBe(true);
            expect(item.author).toBe('Adobe Inc.');
            expect(item.name).toBe(npmPackageName);
            expect(item.description).toBe('A template for testing purposes [1.0.1]');
            expect(item.latestVersion).toBe('1.0.1');
            expect(typeof item.publishDate === 'string').toBe(true);
            expect(item.extension).toEqual({ 'serviceCode': 'dx/excshell/1' });
            expect(item.categories).toEqual(['action', 'ui']);
            expect(item.apis).toEqual([
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
            ]);
            expect(item.adobeRecommended).toBe(adobeRecommended);
            expect(item.keywords.sort()).toEqual(['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template'].sort());
            expect(item.status).toBe(TEMPLATE_STATUS_APPROVED);
            expect(item.links).toEqual({ 'npm': `https://www.npmjs.com/package/${npmPackageName}`, 'github': gitHubUrl });
        });

        const script = '../src/add-to-registry.js';
        process.argv = ['node', script, 'tests/templatePackage', gitHubUrl, npmPackageName];
        jest.isolateModules(async () => {
            await require(script);
        });
    });

    test('Verify that "add-to-registry.js" correctly processes InVerification template', async () => {
        const gitHubUrl = 'https://github.com/adobe/app-builder-template';
        const npmPackageName = '@adobe/app-builder-template';
        const adobeRecommended = false;
        isAdobeRecommended.mockReturnValue(adobeRecommended);
        isInRegistry.mockReturnValue(true);
        const inVerificationRegistryItem = generateRegistryItem(npmPackageName, TEMPLATE_STATUS_IN_VERIFICATION);
        getFromRegistry.mockReturnValue(inVerificationRegistryItem);
        updateInRegistry.mockImplementation((item) => {
            expect(item.id).toBe(inVerificationRegistryItem.id);
            expect(item.author).toBe('Adobe Inc.');
            expect(item.name).toBe(inVerificationRegistryItem.name);
            expect(item.description).toBe('A template for testing purposes [1.0.1]');
            expect(item.latestVersion).toBe('1.0.1');
            expect(typeof item.publishDate === 'string').toBe(true);
            expect(item.extension).toEqual({ 'serviceCode': 'dx/excshell/1' });
            expect(item.categories).toEqual(['action', 'ui']);
            expect(item.apis).toEqual([
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
            ]);
            expect(item.adobeRecommended).toBe(adobeRecommended);
            expect(item.keywords.sort()).toEqual(['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template'].sort());
            expect(item.status).toBe(TEMPLATE_STATUS_APPROVED);
            expect(item.links).toEqual(inVerificationRegistryItem.links);
        });

        const script = '../src/add-to-registry.js';
        process.argv = ['node', script, 'tests/templatePackage', gitHubUrl, npmPackageName];
        jest.isolateModules(async () => {
            await require(script);
        });
    });

    test('Verify that "add-to-registry.js" adds template missing optional properties in install.yml', async () => {
        const gitHubUrl = 'https://github.com/company1/app-builder-template';
        const npmPackageName = '@company1/app-builder-template';
        const adobeRecommended = true;
        isAdobeRecommended.mockReturnValue(adobeRecommended);
        isInRegistry.mockReturnValue(false);
        addToRegistry.mockImplementation((item) => {
            expect(typeof item.id === 'string').toBe(true);
            expect(item.author).toBe('Company1 Inc.');
            expect(item.name).toBe(npmPackageName);
            expect(item.description).toBe('A template for testing purposes [1.0.1]');
            expect(item.latestVersion).toBe('1.0.1');
            expect(typeof item.publishDate === 'string').toBe(true);
            expect(Object.prototype.hasOwnProperty.call(item, 'extension')).toBe(false);
            expect(item.categories).toEqual(['action', 'ui']);
            expect(item.apis).toEqual([
                {
                    "code": "AnalyticsSDK",
                    "credentials": "OAuth"
                },
                {
                    "code": "Runtime"
                }
            ]);
            expect(item.adobeRecommended).toBe(adobeRecommended);
            expect(item.keywords.sort()).toEqual(['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template'].sort());
            expect(item.status).toBe(TEMPLATE_STATUS_APPROVED);
            expect(item.links).toEqual({ 'npm': `https://www.npmjs.com/package/${npmPackageName}`, 'github': gitHubUrl });
        });

        const script = '../src/add-to-registry.js';
        process.argv = ['node', script, 'tests/templatePackageNotImplementingExtensionPoint', gitHubUrl, npmPackageName];
        jest.isolateModules(async () => {
            await require(script);
        });
    });
});
