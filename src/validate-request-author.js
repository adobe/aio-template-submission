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
const axios = require('axios').default;

(async () => {
  try {
    const myArgs = process.argv.slice(2);
    const userLogin = myArgs[0];
    const npmPackage = myArgs[1];
    const githubRepoOwner = myArgs[2];
    const githubRepo = myArgs[3];

    const url = `https://api.github.com/repos/${githubRepoOwner}/${githubRepo}/issues?state=closed&labels=add-template&creator=${userLogin}`;
    await axios({
      'method': 'get',
      'url': url
    })
      .then(response => {
        if (response.status !== 200) {
          let errorMessage = `The response code is ${response.status}`;
          throw new Error(errorMessage);
        }
        if (response.data.length === 0) {
          let errorMessage = 'No add-template issues submitted by user login found.';
          core.setOutput('error', ':x: ' + errorMessage);
        } else {
          let found = response.data.find(element => element.body.includes(npmPackage));
          if (found === undefined) {
            let errorMessage = 'Matching add-template issue by user login not found.';
            core.setOutput('error', ':x: ' + errorMessage);
          } else {
            console.log('Github add-template issue by user login found: ' + found.html_url);
            core.setOutput('is-owner', 'true');
          }
        }
      })
      .catch(e => {
        let errorMessage = `Error occurred during fetching "${url}". ${e.message}`;
        throw new Error(errorMessage);
      });
  } catch (e) {
    core.setOutput('error', `:x: ${e.message}`);
    throw e;
  }
})();
