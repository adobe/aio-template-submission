import { URL } from 'url';
import fs from 'fs';
import validateJson from "./validate-json-schema.js";

const __dirname = new URL('.', import.meta.url).pathname;
const REGISTRY_JSON_FILE = __dirname + '/../registry.json';

/**
 * Save the registry json object to registry.json
 *
 * @private
 * @param {object} registry the registry json object
 * @returns {void}
 */
function saveRegistry(registry) {
    const newData = JSON.stringify(registry, null, 4);

    // Validate registry.json
    validateJson(newData);

    // Write to registry.json
    try {
        fs.writeFileSync(REGISTRY_JSON_FILE, newData);
    } catch (e) {
        const errorMessage = ':x: Error occurred during writing to Template Registry.';
        throw new Error(errorMessage);
    }
}

/**
 * Return Template Registry as a json object
 *
 * @returns {object}
 */
export function getRegistry() {
    return JSON.parse(fs.readFileSync(REGISTRY_JSON_FILE));
}

/**
 * Check if the template exists in Template Registry
 *
 * @param {string} templateName the template name
 * @returns {boolean}
 */
export function isInRegistry(templateName) {
    const registry = getRegistry();
    return registry.find(item => item.name === templateName) !== undefined;
}

/**
 * Add the new template item to Template Registry
 *
 * @param {object} item the new template item as a json object
 * @returns {void}
 */
export function addToRegistry(item) {
    const registry = getRegistry();
    registry.push(item);
    saveRegistry(registry);
}

/**
 * Update the template item in Template Registry
 *
 * @param {object} item the updated template item as a json object
 * @returns {void}
 */
export function updateInRegistry(item) {
    const templateName = item.name;
    const registry = getRegistry();
    let index = registry.findIndex(record => record.name === templateName);
    if (index !== -1) {
        registry[index] = item;
        saveRegistry(registry);
    } else {
        const errorMessage = ':x: Template with name `' + templateName + '` does not exist in Template Registry.';
        throw new Error(errorMessage);
    }
}

/**
 * Remove the template from Template Registry
 *
 * @param {string} templateName the template name
 * @returns {void}
 */
export function removeFromRegistry(templateName) {
    const registry = getRegistry();
    let index = registry.findIndex(item => item.name === templateName);
    if (index !== -1) {
        registry.splice(index, 1);
        saveRegistry(registry);
    }
}

/**
 * Get the template from Template Registry by the template name
 *
 * @param {string} templateName the template name
 * @returns {object}
 */
export function getFromRegistry(templateName) {
    const registry = getRegistry();
    const item = registry.find(item => item.name === templateName);
    if (item !== undefined) {
        return item;
    }
    const errorMessage = ':x: Template with name `' + templateName + '` does not exist in Template Registry.';
    throw new Error(errorMessage);
}
