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

        expect(await isAdobeRecommended(`https://github.com/${GITHUB_REPO}`))
            .toBe(true);
    });

    test('Verify that not very popular Github repo cannot be recommended', async () => {
        nock('https://api.github.com')
            .get(`/repos/${GITHUB_REPO}`)
            .times(1)
            .reply(200, { 'stargazers_count': 10 });

        expect(await isAdobeRecommended(`https://github.com/${GITHUB_REPO}`))
            .toBe(false);
    });
});
