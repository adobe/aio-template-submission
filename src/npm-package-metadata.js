const fs = require('fs');
const YAML = require('yaml');

/**
 * Grab template package metadata from package.json and install.yml files
 *
 * @param {string} packagePath a path to template package files
 * @returns {object}
 */
function getNpmPackageMetadata(packagePath) {
    // Grab package.json data
    const packageJson = fs.readFileSync(packagePath + '/package.json', 'utf8');
    const packageJsonData = JSON.parse(packageJson);

    // Grab install.yml data
    const installYml = fs.readFileSync(packagePath + '/install.yml', 'utf8');
    const installYmlData = YAML.parse(installYml);

    return {
        "author": packageJsonData.author,
        "name": packageJsonData.name,
        "description": packageJsonData.description,
        "version": packageJsonData.version,
        "extensions": [].concat(installYmlData.extension).map(item => item.id),
        "categories": [].concat(installYmlData.categories),
        "services": [].concat(installYmlData.services).flat(),
        "keywords": [].concat(packageJsonData.keywords)
    }
}

module.exports = {
    getNpmPackageMetadata
}
