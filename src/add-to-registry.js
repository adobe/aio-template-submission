const { v4: uuidv4 } = require('uuid');
const core = require('@actions/core');
const { isAdobeRecommended } = require('./is-adobe-recommended');
const { isInRegistry, addToRegistry, getFromRegistry, updateInRegistry, TEMPLATE_STATUS_IN_VERIFICATION, TEMPLATE_STATUS_APPROVED }
    = require('./registry');
const fs = require('fs');
const YAML = require('yaml');

// Simple script that collects template metadata and adds it to the registry
(async () => {
    try {
        const myArgs = process.argv.slice(2);

        // Grab package.json data
        const packageJson = fs.readFileSync(myArgs[0] + '/package.json', 'utf8');
        const packageJsonData = JSON.parse(packageJson);

        // Grab install.yml data
        const installYml = fs.readFileSync(myArgs[0] + '/install.yml', 'utf8');
        const installYmlData = YAML.parse(installYml);

        const gitHubUrl = myArgs[1];
        const npmUrl = 'https://www.npmjs.com/package/' + myArgs[2];

        const adobeRecommended = await isAdobeRecommended(gitHubUrl);

        const templateData = {
            "author": packageJsonData.author,
            "name": packageJsonData.name,
            "description": packageJsonData.description,
            "latestVersion": packageJsonData.version,
            "publishDate": (new Date(Date.now())).toISOString(),
            "extensions": [].concat(installYmlData.extension).map(item => item.id),
            "categories": [].concat(installYmlData.categories),
            "services": [].concat(installYmlData.services).flat(),
            "adobeRecommended": adobeRecommended,
            "keywords": [].concat(packageJsonData.keywords),
            "status": TEMPLATE_STATUS_APPROVED,
            "links": {
                "npm": npmUrl,
                "github": gitHubUrl
            }
        }

        if (isInRegistry(templateData.name)) {
            const savedTemplate = getFromRegistry(templateData.name);
            if (savedTemplate.status !== TEMPLATE_STATUS_IN_VERIFICATION) {
                const errorMessage = ':x: Template with name `' + templateData.name + '` already exists in Template Registry.';
                throw new Error(errorMessage);
            }
            const registryItem = {...savedTemplate, ...templateData};
            updateInRegistry(registryItem);
            console.log('Template was verified.', registryItem);
        } else {
            const registryItem = {"id": uuidv4(), ...templateData};
            addToRegistry(registryItem);
            console.log('Template was added.', registryItem);
        }
    } catch (e) {
        core.setOutput('error', e.message);
        throw e;
    }
})();
