const core = require('@actions/core');
const { isAdobeRecommended } = require('./is-adobe-recommended');
const { getNpmPackageMetadata } = require('./npm-package-metadata');
const { getFromRegistry, updateInRegistry } = require('./registry');

// Simple script that collects template metadata and updates it in the registry
(async () => {
    try {
        const myArgs = process.argv.slice(2);
        const packagePath = myArgs[0];
        const gitHubUrl = myArgs[1];
        const npmUrl = 'https://www.npmjs.com/package/' + myArgs[2];

        const npmPackageMetadata = getNpmPackageMetadata(packagePath);
        const adobeRecommended = await isAdobeRecommended(gitHubUrl);

        const templateData = {
            "author": npmPackageMetadata.author,
            "name": npmPackageMetadata.name,
            "description": npmPackageMetadata.description,
            "latestVersion": npmPackageMetadata.version,
            "extensions": npmPackageMetadata.extensions,
            "categories": npmPackageMetadata.categories,
            "services": npmPackageMetadata.services,
            "adobeRecommended": adobeRecommended,
            "keywords": npmPackageMetadata.keywords,
            "links": {
                "npm": npmUrl,
                "github": gitHubUrl
            }
        };
        const savedTemplate = getFromRegistry(npmPackageMetadata.name);
        const updatedTemplate = { ...savedTemplate, ...templateData };
        updateInRegistry(updatedTemplate);
        console.log('Template was updated.', updatedTemplate);
    } catch (e) {
        core.setOutput('error', e.message);
        throw e;
    }
})();
