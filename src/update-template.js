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

const core = require('@actions/core');
const { isAdobeRecommended } = require('./is-adobe-recommended');
const { getNpmPackageMetadata } = require('./npm-package-metadata');
const { getFromRegistry, updateInRegistry } = require('./registry');
const { TEMPLATE_STATUS_APPROVED } = require('../src/registry');

// Simple script that collects template metadata and updates it in the registry
(async () => {
    try {
        const myArgs = process.argv.slice(2);
        const packagePath = myArgs[0];
        const gitHubUrl = myArgs[1];
        const npmUrl = 'https://www.npmjs.com/package/' + myArgs[2];

        const npmPackageMetadata = getNpmPackageMetadata(packagePath);
        const adobeRecommended = isAdobeRecommended(npmPackageMetadata.name);

        const savedTemplate = getFromRegistry(npmPackageMetadata.name);

        let templateData = {
            "author": npmPackageMetadata.author,
            "name": npmPackageMetadata.name,
            "description": npmPackageMetadata.description,
            "latestVersion": npmPackageMetadata.version,
            "categories": npmPackageMetadata.categories,
            "adobeRecommended": adobeRecommended,
            "keywords": npmPackageMetadata.keywords,
            "status": TEMPLATE_STATUS_APPROVED,
            "links": {
                "npm": npmUrl,
                "github": gitHubUrl
            }
        }

        // checking optional properties
        if (npmPackageMetadata.extensions) {
            templateData['extensions'] = npmPackageMetadata.extensions;
        } else {
            delete savedTemplate['extensions']; // this property can be removed from install.yml
        }
        if (npmPackageMetadata.apis) {
            templateData['apis'] = npmPackageMetadata.apis;
        } else {
            delete savedTemplate['apis']; // this property can be removed from install.yml
        }
        if (npmPackageMetadata.runtime) {
            templateData['runtime'] = npmPackageMetadata.runtime;
        } else {
            delete savedTemplate['runtime']; // this property can be removed from install.yml
        }
        if (npmPackageMetadata.event) {
            templateData['event'] = npmPackageMetadata.event;
        } else {
            delete savedTemplate['event']; // this property can be removed from install.yml
        }

        if (!savedTemplate.publishDate) {
            templateData["publishDate"] = (new Date(Date.now())).toISOString()
        }
        const updatedTemplate = { ...savedTemplate, ...templateData };
        updateInRegistry(updatedTemplate);
        console.log('Template was updated.', updatedTemplate);
    } catch (e) {
        core.setOutput('error', e.message);
        throw e;
    }
})();
