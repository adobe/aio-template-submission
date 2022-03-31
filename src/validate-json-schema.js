import * as core from "@actions/core";
import fs from 'fs' ;
import Ajv from 'ajv';

// Validate JSON against registry.schema.json
export default function validateJson(json) {
    const ajv = new Ajv({ strictTuples: false });
    const validate = ajv.compile(JSON.parse(fs.readFileSync('registry.schema.json')));
    const valid = validate(JSON.parse(json));
    if (!valid) {
        core.setOutput('error', ':warning: Attempt to save invalid data to the registry. See `registry.schema.json` for more details.');
        throw new Error(JSON.stringify(validate.errors, null, 2));
    }
}
