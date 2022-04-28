const core = require('@actions/core');
const fs = require('fs');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

/**
 * Validate JSON against registry.schema.json
 *
 * @param json
 */
function validateJson(json) {
    const ajv = new Ajv({strictTuples: false});
    addFormats(ajv);
    const validate = ajv.compile(JSON.parse(fs.readFileSync('registry.schema.json')));
    const valid = validate(JSON.parse(json));
    if (!valid) {
        core.setOutput('error', ':warning: Attempt to save invalid data to the registry. See `registry.schema.json` for more details.');
        throw new Error(JSON.stringify(validate.errors, null, 2));
    }
}

module.exports = validateJson;
