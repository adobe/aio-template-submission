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

const axios = require('axios').default;

/**
 * Get open Github issues for given template
 *
 * @param {string} label Github issue label
 * @param {string} npmPackage template name
 * @param {string} githubRepoOwner a Github repo owner, for example, "adobe"
 * @param {string} githubRepo a Github repo name, for example, "aio-template-submission"
 * @returns {Promise<Object>} issue
 */
 async function getTemplateGithubIssues(label, npmPackage, githubRepoOwner, githubRepo) {
  const url = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/issues?state=open&labels=${label}`;
  const response = await axios.get(url)
  if (response.data.length !== 0) {
    let found = response.data.find(element => element.body.includes(npmPackage));
    if (found !== undefined) {
      return found
    }
  }
  return {}
}

module.exports = {
  getTemplateGithubIssues
}