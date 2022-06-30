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

const { expect, describe, test } = require('@jest/globals');
const { getNpmPackageMetadata } = require('../src/npm-package-metadata');

describe('Verify grabbing npm package metadata', () => {
    test('Verify that getNpmPackageMetadata() grabs npm package metadata', () => {
        const npmPackageMetadata = getNpmPackageMetadata('tests/templatePackage');
        expect(npmPackageMetadata).toEqual(
            {
                'author': 'Adobe Inc.',
                'name': '@adobe/app-builder-template',
                'description': 'A template for testing purposes [1.0.1]',
                'version': '1.0.1',
                'extension': { 'serviceCode': 'dx/excshell/1' },
                'categories': ['action', 'ui'],
                'apis': [
                    {
                        "code": "AnalyticsSDK",
                        "credentials": "OAuth"
                    },
                    {
                        "code": "CampaignStandard"
                    },
                    {
                        "code": "Runtime"
                    }
                ],
                'keywords': ['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template']
            }
        );
    });

    test('Verify that getNpmPackageMetadata() grabs npm package metadata from a template missing optional properties in install.yml', () => {
        const npmPackageMetadata = getNpmPackageMetadata('tests/templatePackageNotImplementingExtensionPoint');
        expect(npmPackageMetadata).toEqual(
            {
                'author': 'Company1 Inc.',
                'name': '@company1/app-builder-template',
                'description': 'A template for testing purposes [1.0.1]',
                'version': '1.0.1',
                'categories': ['action', 'ui'],
                'apis': [
                    {
                        "code": "AnalyticsSDK",
                        "credentials": "OAuth"
                    },
                    {
                        "code": "Runtime"
                    }
                ],
                'keywords': ['aio', 'adobeio', 'app', 'templates', 'aio-app-builder-template']
            }
        );
        expect(Object.prototype.hasOwnProperty.call(npmPackageMetadata, 'extension')).toBe(false);
    });
});
