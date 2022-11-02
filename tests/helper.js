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

const { v4: uuidv4 } = require('uuid');
const { execSync } = require('child_process');
const { TEMPLATE_STATUS_APPROVED } = require('../src/registry');

/**
 * @param {string} templateName template name
 * @param {string} templateStatus template status
 * @returns {object}
 */
function generateRegistryItem(templateName, templateStatus = TEMPLATE_STATUS_APPROVED) {
    let githubRepo = templateName.replace('@', '');
    let registryItem = {
        'id': uuidv4(),
        'name': templateName,
        'status': templateStatus,
        'links': {
            'npm': `https://www.npmjs.com/package/${templateName}`,
            'github': `https://github.com/${githubRepo}`
        }
    }
    if (templateStatus === TEMPLATE_STATUS_APPROVED) {
        registryItem = {
            ...registryItem, ...{
                'author': 'Adobe Inc.',
                'description': 'A template for testing purposes',
                'latestVersion': '1.0.1',
                'publishDate': (new Date(Date.now())).toISOString(),
                'extensions': [{ 'extensionPointId': 'dx/excshell/1' }],
                'categories': [
                    'action',
                    'ui'
                ],
                'runtime': true,
                'apis': [
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
                'event': { 'consumer': { 'name': 'registration-name', 'description': 'registration-description', 'events_of_interest': [{ 'provider_id': 'provider-id-1', 'event-code': 'event-code-1' }] }, 'provider': { 'label': 'provider-name', 'description': 'provider-description', 'docs-url': 'provider-docs-url', 'events': [{ 'event_code': 'event-code-1', 'label': 'event-1-label', 'description': 'event-1-description' }] } },
                'keywords': [
                    'aio',
                    'adobeio',
                    'aio-app-builder-template'
                ]
            }
        }
    }
    return registryItem;
}

/**
 * @returns {string}
 */
function getRegistryJsonSchema() {
    const stdout = execSync('cat registry.schema.json');
    return stdout;
}

module.exports = {
    generateRegistryItem, getRegistryJsonSchema
}
