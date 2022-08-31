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
            expect(item.extensions).toEqual([{ 'extensionPointId': 'dx/excshell/1' }]);
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
            expect(item.extensions).toEqual([{ 'extensionPointId': 'dx/excshell/1' }]);
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
            expect(item.event).toEqual({ 'consumer': { 'name': 'registration-name', 'description': 'registration-description', 'events_of_interest': [{ 'provider_id': 'provider-id-1', 'event-code': 'event-code-1' }] }, 'provider': { 'label': 'provider-name', 'description': 'provider-description', 'docs-url': 'provider-docs-url', 'events': [{ 'event_code': 'event-code-1', 'label': 'event-1-label', 'description': 'event-1-description' }] } });
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
            expect(Object.prototype.hasOwnProperty.call(item, 'extensions')).toBe(false);
            expect(item.categories).toEqual(['action', 'ui']);
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
