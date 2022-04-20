const { expect, describe, test } = require('@jest/globals');
const nock = require('nock');
const { isAdobeRecommended } = require('../src/is-adobe-recommended');

const GITHUB_REPO = 'test/app-builder-template';

describe('Verify "Adobe Recommended" flag calculations', () => {
    test('Verify that popular Github repo can be recommended', async () => {
        nock('https://api.github.com')
            .get(`/repos/${GITHUB_REPO}`)
            .times(1)
            .reply(200, { 'stargazers_count': 100 });

        await expect(isAdobeRecommended(`https://github.com/${GITHUB_REPO}`))
            .resolves.toBe(true);
    });

    test('Verify that not very popular Github repo cannot be recommended', async () => {
        nock('https://api.github.com')
            .get(`/repos/${GITHUB_REPO}`)
            .times(1)
            .reply(200, { 'stargazers_count': 10 });

        await expect(isAdobeRecommended(`https://github.com/${GITHUB_REPO}`))
            .resolves.toBe(false);
    });

    test('Verify that exception is thrown for non-existing Github repo', async () => {
        nock('https://api.github.com')
            .get('/repos/non-existing-repo')
            .times(1)
            .reply(404);

        await expect(isAdobeRecommended('https://github.com/non-existing-repo'))
            .rejects.toThrow(':x: Error occurred during fetching "https://api.github.com/repos/non-existing-repo". Request failed with status code 404');
    });
});
