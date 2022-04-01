import fs from 'fs'
import * as core from '@actions/core'
import validateJson from "./validate-json-schema.js";

const myArgs = process.argv.slice(2);
const pluginName = myArgs[0];
const registry = fs.readFileSync("registry.json");
const registryObject = JSON.parse(registry);
let index = registryObject.findIndex(element => element.name == pluginName)
if (index != -1) {
  registryObject.splice(index, 1);
} else {
  const errorMessage = ':x: Template with name `' + pluginName + '` does not exist in Template Registry.';
  core.setOutput('error', errorMessage);
  throw new Error(errorMessage)
}

const newData = JSON.stringify(registryObject, null, 4);

// Validate registry.json file
validateJson(newData)

fs.writeFile("registry.json", newData, err => {
    if(err) {
      core.setOutput('error', ':warning: Error occurred during removing template from Template Registry.')
      throw err;
    }
    console.log('Template "' + pluginName + '"was removed.', newData);
}); 
