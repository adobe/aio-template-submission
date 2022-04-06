import { v4 as uuidv4 } from 'uuid';
import * as core from '@actions/core';
import { isAdobeRecommended } from "./is-adobe-recommended.js";
import { isInRegistry, addToRegistry } from "./registry.js";

// Simple script that collects template metadata and adds it to the registry

(async () => {
    try {
        const myArgs = process.argv.slice(2);
        const packageData = JSON.parse(myArgs[0]);
        const gitHubUrl = myArgs[1];
        const npmUrl = myArgs[2];

        const adobeRecommended = await isAdobeRecommended(gitHubUrl);

        // Create registry item object
        const registryItem = {
            "id": uuidv4(),
            "author": packageData.author,
            "name": packageData.name,
            "description": packageData.description,
            "latestVersion": packageData.version,
            "publishDate": new Date(Date.now()),
            // ToDo: get data from user input or keywords
            "extensionPoints": [
                "dx-spa",
                "dx-commerce"
            ],
            "categories": [
                "aio-action",
                "aio-graphql"
            ],
            "adobeRecommended": adobeRecommended,
            "keywords": [].concat(packageData.keywords),
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
