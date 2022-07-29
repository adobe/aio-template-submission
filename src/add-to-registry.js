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

        if (npmPackageMetadata.extensions) {
            templateData['extensions'] = npmPackageMetadata.extensions;
        }
        if (npmPackageMetadata.apis) {
            templateData['apis'] = npmPackageMetadata.apis;
        }
        if (npmPackageMetadata.runtime) {
            templateData['runtime'] = npmPackageMetadata.runtime;
        }
        if (npmPackageMetadata.event) {
            templateData['event'] = npmPackageMetadata.event;
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
