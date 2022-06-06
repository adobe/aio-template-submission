const { v4: uuidv4 } = require('uuid');
const core = require('@actions/core');
const { isAdobeRecommended } = require('./is-adobe-recommended');
const { getNpmPackageMetadata } = require('./npm-package-metadata');
const { isInRegistry, addToRegistry, getFromRegistry, updateInRegistry, TEMPLATE_STATUS_IN_VERIFICATION, TEMPLATE_STATUS_APPROVED }
    = require('./registry');

// Simple script that collects template metadata and adds it to the registry
(async () => {
    try {
        const myArgs = process.argv.slice(2);
        const packagePath = myArgs[0];
        const gitHubUrl = myArgs[1];
        const npmUrl = 'https://www.npmjs.com/package/' + myArgs[2];

        const npmPackageMetadata = getNpmPackageMetadata(packagePath);
        const adobeRecommended = await isAdobeRecommended(gitHubUrl);

        let templateData = {
            "author": npmPackageMetadata.author,
            "name": npmPackageMetadata.name,
            "description": npmPackageMetadata.description,
            "latestVersion": npmPackageMetadata.version,
            "publishDate": (new Date(Date.now())).toISOString(),
            "categories": npmPackageMetadata.categories,
            "adobeRecommended": adobeRecommended,
            "keywords": npmPackageMetadata.keywords,
            "status": TEMPLATE_STATUS_APPROVED,
            "links": {
                "npm": npmUrl,
                "github": gitHubUrl
            }
        }

        if (npmPackageMetadata.extension) {
            templateData['extension'] = npmPackageMetadata.extension;
        }
        if (npmPackageMetadata.apis) {
            templateData['apis'] = npmPackageMetadata.apis;
        }

        if (isInRegistry(templateData.name)) {
            const savedTemplate = getFromRegistry(templateData.name);
            if (savedTemplate.status !== TEMPLATE_STATUS_IN_VERIFICATION) {
                const errorMessage = ':x: Template with name `' + templateData.name + '` already exists in Template Registry.';
                throw new Error(errorMessage);
            }
            const registryItem = { ...savedTemplate, ...templateData };
            updateInRegistry(registryItem);
            console.log('Template was verified.', registryItem);
        } else {
            const registryItem = { "id": uuidv4(), ...templateData };
            addToRegistry(registryItem);
            console.log('Template was added.', registryItem);
        }
    } catch (e) {
        core.setOutput('error', e.message);
        throw e;
    }
})();
