import * as core from '@actions/core';
import { getFromRegistry, removeFromRegistry } from "./registry.js";

const myArgs = process.argv.slice(2);
const templateName = myArgs[0];

try {
  const item = getFromRegistry(templateName);
  removeFromRegistry(templateName);
  console.log('Template "' + templateName + '" was removed.', item);
} catch (e) {
  core.setOutput('error', e.message);
  throw e;
}
