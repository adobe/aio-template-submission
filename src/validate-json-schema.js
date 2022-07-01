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
