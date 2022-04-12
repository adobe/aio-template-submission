import fetch from 'node-fetch';

const STARGAZERS_THRESHOLD = 10;

/**
 * Grab the stargazers count for the specified GitHub repo
 *
 * @private
 * @param {string} gitHubUrl the GitHub repo URL
 * @returns {Promise<number>}
 */
async function getStargazersCount(gitHubUrl) {
    const repo = gitHubUrl.split('/').slice(-2).join('/');

    let stargazersCount;
    const githubApiUrl = 'https://api.github.com/repos/' + repo;
    await fetch(githubApiUrl)
        .then(response => {
            if (response.status !== 200) {
                const errorMessage = `The response code is ${response.status}`;
                throw new Error(errorMessage);
            }
            return response.json();
        })
        .then(data => {
            stargazersCount = data['stargazers_count'];
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
export async function isAdobeRecommended(gitHubUrl) {
    let stargazersCount = await getStargazersCount(gitHubUrl);
    return stargazersCount > STARGAZERS_THRESHOLD;
}
