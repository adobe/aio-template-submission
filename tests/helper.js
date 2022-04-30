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
                'extension': {
                    'serviceCode': 'dx/excshell/1'
                },
                'categories': [
                    'action',
                    'ui'
                ],
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
                'adobeRecommended': true,
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
