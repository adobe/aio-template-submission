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

/**
 * Criteria for needing additional verification:
 * - published by third party developer (not under @adobe org)
 *
 *
 * @param {string} npmPackage the name of the NPM package
 * @returns {boolean}
 */
 function needsMoreVerification(npmPackage) {
  return !npmPackage.startsWith('@adobe/');
}

(async () => {
  const myArgs = process.argv.slice(2);
  const npmPackage = myArgs[0];

  if (needsMoreVerification(npmPackage)) {
    core.setOutput('more-verification', 'true');
  } else {
    core.setOutput('more-verification', 'false');
  }
  
})();
