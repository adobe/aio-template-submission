import { v4 as uuidv4 } from 'uuid';
import * as core from '@actions/core';
import { isAdobeRecommended } from './is-adobe-recommended.js';
import { isInRegistry, addToRegistry } from './registry.js';
import fs from 'fs';
import YAML from 'yaml';

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

        // Create registry item object
        const registryItem = {
            "id": uuidv4(),
            "author": packageJsonData.author,
            "name": packageJsonData.name,
            "description": packageJsonData.description,
            "latestVersion": packageJsonData.version,
            "publishDate": new Date(Date.now()),
            "extensions": [].concat(installYmlData.extension).map(item => item.id),
            "categories": [].concat(installYmlData.categories),
            "services": [].concat(installYmlData.services).flat(),
            "adobeRecommended": adobeRecommended,
            "keywords": [].concat(packageJsonData.keywords),
            "links": {
                "npm": npmUrl,
                "github": gitHubUrl
            }
        }

        // Check for duplicates
        if (isInRegistry(registryItem.name)) {
            const errorMessage = ':x: Template with name `' + registryItem.name + '` already exists in Template Registry.';
            throw new Error(errorMessage);
        }

        addToRegistry(registryItem);
        console.log('Template was added.', registryItem);
    } catch (e) {
        core.setOutput('error', e.message);
        throw e;
    }
})();
