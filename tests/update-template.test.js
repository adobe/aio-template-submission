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

const { generateRegistryItem } = require('./helper');
const { isAdobeRecommended } = require('../src/is-adobe-recommended');
const { getFromRegistry, updateInRegistry, TEMPLATE_STATUS_APPROVED, TEMPLATE_STATUS_IN_VERIFICATION }
    = require('../src/registry');

const gitHubUrl = 'https://github.com/adobe/app-builder-template';
const npmPackageName = '@adobe/app-builder-template';

jest.mock('../src/is-adobe-recommended');
jest.mock('../src/registry');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Verify updating template in registry', () => {
    test('Verify that "update-template.js" updates template', async () => {
        const adobeRecommended = false;
        isAdobeRecommended.mockReturnValue(adobeRecommended);
        const existingRegistryItem = generateRegistryItem(npmPackageName);
        getFromRegistry.mockReturnValue(existingRegistryItem);
        updateInRegistry.mockImplementation((item) => {
            expect(item).toEqual({
                'id': existingRegistryItem.id,
                'name': existingRegistryItem.name,
                'status': TEMPLATE_STATUS_APPROVED,
                'links': existingRegistryItem.links,
                'author': 'Adobe Inc.',
                'description': 'A template for testing purposes [1.0.1]',
                'latestVersion': '1.0.1',
                'publishDate': existingRegistryItem.publishDate,
                'extensions': [{ 'extensionPointId': 'dx/excshell/1' }],
                'categories': ['action', 'ui'],
                'runtime': true,
                'apis': [
                    { 'code': 'AnalyticsSDK', 'credentials': 'OAuth' },
                    { 'code': 'CampaignStandard' },
                    { 'code': 'Runtime' }
                ],
                'event': existingRegistryItem.event,
                'adobeRecommended': adobeRecommended,
                'keywords': ['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template']
            });
        });

        const script = '../src/update-template.js';
        process.argv = ['node', script, 'tests/templatePackage', gitHubUrl, npmPackageName];
        jest.isolateModules(async () => {
            await require(script);
        });
    });

    test('Verify that "update-template.js" sets publishDate if missing', async () => {
        const adobeRecommended = true;
        isAdobeRecommended.mockReturnValue(adobeRecommended);
        const newRegistryItemAddedViaAPI = {
            'id': 'some-id',
            'name': npmPackageName,
            'status': TEMPLATE_STATUS_IN_VERIFICATION,
            'links': {
                'npm': `https://www.npmjs.com/package/${npmPackageName}`,
                'github': gitHubUrl
            }
        };
        getFromRegistry.mockReturnValue(newRegistryItemAddedViaAPI);
        updateInRegistry.mockImplementation((item) => {
            expect(item).toEqual({
                'id': 'some-id',
                'name': npmPackageName,
                'status': TEMPLATE_STATUS_APPROVED,
                'links': {
                    'npm': `https://www.npmjs.com/package/${npmPackageName}`,
                    'github': gitHubUrl
                },
                'author': 'Adobe Inc.',
                'description': 'A template for testing purposes [1.0.1]',
                'latestVersion': '1.0.1',
                'categories': ['action', 'ui'],
                'adobeRecommended': adobeRecommended,
                'keywords': ['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template'],
                'extensions': [{ 'extensionPointId': 'dx/excshell/1' }],
                'apis': [
                    { 'code': 'AnalyticsSDK', 'credentials': 'OAuth' },
                    { 'code': 'CampaignStandard' },
                    { 'code': 'Runtime' }
                ],
                'event': { 'consumer': { 'name': 'registration-name', 'description': 'registration-description', 'events_of_interest': [{ 'provider_id': 'provider-id-1', 'event-code': 'event-code-1' }] }, 'provider': { 'label': 'provider-name', 'description': 'provider-description', 'docs-url': 'provider-docs-url', 'events': [{ 'event_code': 'event-code-1', 'label': 'event-1-label', 'description': 'event-1-description' }] } },
                'runtime': true,
                'publishDate': expect.any(String)
            });
        });

        const script = '../src/update-template.js';
        process.argv = ['node', script, 'tests/templatePackage', gitHubUrl, npmPackageName];
        jest.isolateModules(async () => {
            await require(script);
        });
    });
});
