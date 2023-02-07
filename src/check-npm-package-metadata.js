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
const metadata = require('@adobe/aio-lib-template-validation');

(async () => {
  const myArgs = process.argv.slice(2);
  const path = myArgs[0];
  try {
    var results = await metadata.checkTemplateMetadata(path);
  } catch (e) {
    core.setOutput('error', `:x: ${e.message}`);
    throw e;
  }

  if (results.stats.failures !== 0) {
    let errors = [];
    for (const failure of results.failures) {
      errors.push(`\n**${failure.description}**\n`);
      for (const error of failure.errors) {
        errors.push(`:x: ${error.message || error}`);
        if (error.suggestion) {
          errors.push(`${error.suggestion}`);
        }
      }
    }
    let errorMessage = errors.join('\n');
    core.setOutput('error', `${errorMessage}`);
    throw new Error(errorMessage);
  }

})();
