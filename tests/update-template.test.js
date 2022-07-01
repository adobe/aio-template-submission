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
const { getFromRegistry, updateInRegistry, TEMPLATE_STATUS_APPROVED }
    = require('../src/registry');

jest.mock('../src/is-adobe-recommended');
jest.mock('../src/registry');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Verify updating template in registry', () => {
    test('Verify that "update-template.js" updates template', async () => {
        const gitHubUrl = 'https://github.com/adobe/app-builder-template';
        const npmPackageName = '@adobe/app-builder-template';
        const adobeRecommended = false;
        isAdobeRecommended.mockReturnValue(adobeRecommended);
        const existingRegistryItem = generateRegistryItem(npmPackageName);
        getFromRegistry.mockReturnValue(existingRegistryItem);
        updateInRegistry.mockImplementation((item) => {
            expect(item.id).toBe(existingRegistryItem.id);
            expect(item.author).toBe('Adobe Inc.');
            expect(item.name).toBe(existingRegistryItem.name);
            expect(item.description).toBe('A template for testing purposes [1.0.1]');
            expect(item.latestVersion).toBe('1.0.1');
            expect(item.publishDate).toBe(existingRegistryItem.publishDate);
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
            expect(item.links).toEqual(existingRegistryItem.links);
        });

        const script = '../src/update-template.js';
        process.argv = ['node', script, 'tests/templatePackage', gitHubUrl, npmPackageName];
        jest.isolateModules(async () => {
            await require(script);
        });
    });
});
