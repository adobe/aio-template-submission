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
const { generateRegistryItem, getRegistryJsonSchema } = require('./helper');
const { when } = require('jest-when');
const fs = require('fs');
const registry = require('../src/registry');

jest.mock('fs');
when(fs.readFileSync).calledWith('registry.schema.json').mockReturnValue(getRegistryJsonSchema());

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Verify "Template Registry" operations', () => {
    test('Verify getting "Template Registry"', () => {
        let registryItems = [];
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-1'));
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-2'));
        when(fs.readFileSync).calledWith('registry.json').mockReturnValue(JSON.stringify(registryItems, null, 4));
        expect(registry.getRegistry())
            .toEqual(registryItems);
    });

    test('Verify that isInRegistry() returns true for existing template', () => {
        const rewire = require('rewire');
        const registry = rewire('../src/registry');

        let registryItems = [];
        registryItems.push(generateRegistryItem('@adobe/template-1'));
        registryItems.push(generateRegistryItem('@adobe/template-2'));
        registry.__set__('getRegistry', () => registryItems);
        expect(registry.isInRegistry('@adobe/template-1')).toBe(true);
    });

    test('Verify that isInRegistry() returns false for non-existing template', () => {
        const rewire = require('rewire');
        const registry = rewire('../src/registry');

        let registryItems = [];
        registryItems.push(generateRegistryItem('@adobe/template-1'));
        registryItems.push(generateRegistryItem('@adobe/template-2'));
        registry.__set__('getRegistry', () => registryItems);
        expect(registry.isInRegistry('@adobe/template-none')).toBe(false);
    });

    test('Verify that addToRegistry() adds template', () => {
        let registryItems = [];
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-1'));
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-2'));
        when(fs.readFileSync).calledWith('registry.json').mockReturnValue(JSON.stringify(registryItems, null, 4));
        let newRegistryItem = generateRegistryItem('@adobe/app-builder-template-3');
        let newRegistryItems = registryItems;
        newRegistryItems.push(newRegistryItem);

        expect(registry.addToRegistry(newRegistryItem)).toBeUndefined();
        expect(fs.writeFileSync).toHaveBeenCalledWith('registry.json', JSON.stringify(newRegistryItems, null, 4));
    });

    test('Verify that updateInRegistry() updates existing template', () => {
        let registryItem1 = generateRegistryItem('@adobe/app-builder-template-1');
        let registryItem2 = generateRegistryItem('@adobe/app-builder-template-2');
        let registryItems = [registryItem1, registryItem2];
        when(fs.readFileSync).calledWith('registry.json').mockReturnValue(JSON.stringify(registryItems, null, 4));
        let updatedRegistryItem = registryItem1;
        updatedRegistryItem.latestVersion = '1.2.3';
        updatedRegistryItem.author = 'Test Company';
        let updatedRegistryItems = [updatedRegistryItem, registryItem2];

        expect(registry.updateInRegistry(updatedRegistryItem)).toBeUndefined();
        expect(fs.writeFileSync).toHaveBeenCalledWith('registry.json', JSON.stringify(updatedRegistryItems, null, 4));
    });

    test('Verify that updateInRegistry() throws exception for non-existing template', () => {
        let registryItems = [];
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-1'));
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-2'));
        when(fs.readFileSync).calledWith('registry.json').mockReturnValue(JSON.stringify(registryItems, null, 4));
        const templateName = '@adobe/app-builder-template-3';
        let nonExistingRegistryItem = generateRegistryItem(templateName);

        expect(() => registry.updateInRegistry(nonExistingRegistryItem))
            .toThrow(':x: Template with name `' + templateName + '` does not exist in Template Registry.');
    });

    test('Verify that removeFromRegistry() removes existing template', () => {
        let registryItem1 = generateRegistryItem('@adobe/app-builder-template-1');
        const templateName = '@adobe/app-builder-template-2';
        let registryItem2 = generateRegistryItem(templateName);
        let registryItem3 = generateRegistryItem('@adobe/app-builder-template-3');
        let registryItems = [registryItem1, registryItem2, registryItem3];
        when(fs.readFileSync).calledWith('registry.json').mockReturnValue(JSON.stringify(registryItems, null, 4));
        let updatedRegistryItems = [registryItem1, registryItem3];

        expect(registry.removeFromRegistry(templateName)).toBeUndefined();
        expect(fs.writeFileSync).toHaveBeenCalledWith('registry.json', JSON.stringify(updatedRegistryItems, null, 4));
    });

    test('Verify that removeFromRegistry() does not change "Template Registry" for non-existing template', () => {
        let registryItems = [];
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-1'));
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-2'));
        when(fs.readFileSync).calledWith('registry.json').mockReturnValue(JSON.stringify(registryItems, null, 4));

        expect(registry.removeFromRegistry('non-existing-template')).toBeUndefined();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('Verify that getFromRegistry() finds existing template', () => {
        let registryItem1 = generateRegistryItem('@adobe/app-builder-template-1');
        const templateName = '@adobe/app-builder-template-2';
        let registryItem2 = generateRegistryItem(templateName);
        let registryItem3 = generateRegistryItem('@adobe/app-builder-template-3');
        let registryItems = [registryItem1, registryItem2, registryItem3];
        when(fs.readFileSync).calledWith('registry.json').mockReturnValue(JSON.stringify(registryItems, null, 4));

        expect(registry.getFromRegistry(templateName)).toEqual(registryItem2);
    });

    test('Verify that getFromRegistry() throws exception for non-existing template', () => {
        let registryItems = [];
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-1'));
        registryItems.push(generateRegistryItem('@adobe/app-builder-template-2'));
        when(fs.readFileSync).calledWith('registry.json').mockReturnValue(JSON.stringify(registryItems, null, 4));

        const templateName = 'non-existing-template';
        expect(() => registry.getFromRegistry(templateName))
            .toThrow(':x: Template with name `' + templateName + '` does not exist in Template Registry.');
    });
});
