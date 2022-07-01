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

const STARGAZERS_THRESHOLD = 10;

/**
 * Grab the stargazers count for the specified GitHub repo
 *
 * @private
 * @param {string} gitHubUrl the GitHub repo URL
 * @returns {Promise<number>}
 */
async function getStargazersCount(gitHubUrl) {
    const repo = gitHubUrl.replace('https://github.com/', '');

    let stargazersCount;
    const githubApiUrl = 'https://api.github.com/repos/' + repo;
    await axios({
        'method': 'get',
        'url': githubApiUrl
    })
        .then(response => {
            stargazersCount = response.data['stargazers_count'];
        })
        .catch(e => {
            const errorMessage = `:x: Error occurred during fetching "${githubApiUrl}". ${e.message}`;
            throw new Error(errorMessage);
        });
    return stargazersCount;
}

/**
 * We expect the GitHub repo to have more than STARGAZERS_THRESHOLD stargazers in order to be featured
 *
 * @param {string} gitHubUrl the GitHub repo URL
 * @returns {Promise<boolean>}
 */
async function isAdobeRecommended(gitHubUrl) {
    let stargazersCount = await getStargazersCount(gitHubUrl);
    return stargazersCount > STARGAZERS_THRESHOLD;
}

module.exports = {
    isAdobeRecommended
}
