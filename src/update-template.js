import * as core from '@actions/core';
import { isAdobeRecommended } from './is-adobe-recommended.js';
import { getFromRegistry, updateInRegistry } from './registry.js';
import fs from 'fs';
import YAML from 'yaml';

// Simple script that collects template metadata and updates it in the registry
(async () => {
    try {
        const myArgs = process.argv.slice(2);
        const packagePath = myArgs[0];
        const gitHubUrl = myArgs[1];
        const npmUrl = 'https://www.npmjs.com/package/' + myArgs[2];

        // Grab package.json data
        const packageJson = fs.readFileSync(packagePath + '/package.json', 'utf8');
        const packageJsonData = JSON.parse(packageJson);

        // Grab install.yml data
        const installYml = fs.readFileSync(packagePath + '/install.yml', 'utf8');
        const installYmlData = YAML.parse(installYml);

        const adobeRecommended = await isAdobeRecommended(gitHubUrl);

        const templateData = {
            "author": packageJsonData.author,
            "name": packageJsonData.name,
            "description": packageJsonData.description,
            "latestVersion": packageJsonData.version,
            "extensions": [].concat(installYmlData.extension).map(item => item.id),
            "categories": [].concat(installYmlData.categories),
            "services": [].concat(installYmlData.services).flat(),
            "adobeRecommended": adobeRecommended,
            "keywords": [].concat(packageJsonData.keywords),
            "links": {
                "npm": npmUrl,
                "github": gitHubUrl
            }
        };
        const savedTemplate = getFromRegistry(packageJsonData.name);
        const updatedTemplate = { ...savedTemplate, ...templateData };
        updateInRegistry(updatedTemplate);
        console.log('Template was updated.', updatedTemplate);
    } catch (e) {
        core.setOutput('error', e.message);
        throw e;
    }
})();
