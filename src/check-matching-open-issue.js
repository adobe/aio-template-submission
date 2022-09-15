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
const { getTemplateGithubIssues } = require('../src/get-matching-open-issue');

(async () => {
  try {
    const myArgs = process.argv.slice(2);
    const label = myArgs[0]
    const npmPackage = myArgs[1];
    const githubRepoOwner = myArgs[2];
    const githubRepo = myArgs[3];

    const matchingOpenIssue = getTemplateGithubIssues(label, npmPackage, githubRepoOwner, githubRepo)
    if('number' in matchingOpenIssue) {
      console.log('Github open issue for approved template found: ' + matchingOpenIssue.number);
      core.setOutput('issue-number', matchingOpenIssue.number);
    } else {
      console.log('No open Github issue for approved template found')
    }
  } catch (e) {
    core.setOutput('error', `:x: ${e.message}`);
    throw e;
  }
})();