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
const { getFromRegistry, removeFromRegistry } = require('./registry');

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
