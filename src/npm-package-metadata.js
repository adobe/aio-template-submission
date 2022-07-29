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

    let npmPackageMetadata = {
        "author": packageJsonData.author,
        "name": packageJsonData.name,
        "description": packageJsonData.description,
        "version": packageJsonData.version,
        "keywords": [].concat(packageJsonData.keywords),
        "categories": [].concat(installYmlData.categories)
    }
    // "extensions", "apis", "runtime", "event" are optional
    if (installYmlData.extensions) {
        npmPackageMetadata["extensions"] = installYmlData.extensions;
    }
    if (installYmlData.apis) {
        npmPackageMetadata["apis"] = installYmlData.apis;
    }
    if (installYmlData.runtime) {
        npmPackageMetadata["runtime"] = installYmlData.runtime;
    }
    if (installYmlData.event) {
        npmPackageMetadata["event"] = installYmlData.event;
    }
    return npmPackageMetadata;
}

module.exports = {
    getNpmPackageMetadata
}
