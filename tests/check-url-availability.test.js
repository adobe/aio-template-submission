/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { checkUrlAvailability } = require('../src/check-url-availability');

const url = 'https://github.com/adobe/some-template';
const noWait = { baseDelayMs: 0 };

const respond = (status) => ({ status });

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    delete global.fetch;
});

describe('checkUrlAvailability', () => {
    test('a 200 is available after one request', async () => {
        global.fetch.mockResolvedValueOnce(respond(200));
        await expect(checkUrlAvailability(url, noWait)).resolves.toEqual({ available: true, error: '' });
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(url);
    });

    test('works without options', async () => {
        global.fetch.mockResolvedValueOnce(respond(200));
        await expect(checkUrlAvailability(url)).resolves.toEqual({ available: true, error: '' });
    });

    test('a 404 is final and is not retried', async () => {
        global.fetch.mockResolvedValue(respond(404));
        await expect(checkUrlAvailability(url, noWait)).resolves.toEqual({
            available: false,
            error: `Error fetching "${url}". Response code is 404`
        });
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test.each([408, 429, 500, 502, 503])('a %i is retried and a later 200 is available', async (status) => {
        global.fetch.mockResolvedValueOnce(respond(status)).mockResolvedValueOnce(respond(200));
        await expect(checkUrlAvailability(url, noWait)).resolves.toEqual({ available: true, error: '' });
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('a network error is retried and a later 200 is available', async () => {
        global.fetch.mockRejectedValueOnce(new Error('socket hang up')).mockResolvedValueOnce(respond(200));
        await expect(checkUrlAvailability(url, noWait)).resolves.toEqual({ available: true, error: '' });
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('keeps failing: stops after the retries and says how many attempts were made', async () => {
        global.fetch.mockResolvedValue(respond(503));
        const result = await checkUrlAvailability(url, noWait);
        expect(result.available).toBe(false);
        expect(result.error).toBe(`Error fetching "${url}". Response code is 503 Gave up after 4 attempts.`);
        expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    test('keeps failing with a network error: reports the error message', async () => {
        global.fetch.mockRejectedValue(new Error('getaddrinfo ENOTFOUND github.com'));
        const result = await checkUrlAvailability(url, { retries: 1, baseDelayMs: 0 });
        expect(result.available).toBe(false);
        expect(result.error).toBe(`Error occurred during fetching "${url}". getaddrinfo ENOTFOUND github.com Gave up after 2 attempts.`);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('a 404 after a failed try is final without further retries', async () => {
        global.fetch.mockResolvedValueOnce(respond(503)).mockResolvedValue(respond(404));
        const result = await checkUrlAvailability(url, noWait);
        expect(result.available).toBe(false);
        expect(result.error).toBe(`Error fetching "${url}". Response code is 404 Gave up after 2 attempts.`);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('retries: 0 makes a single request', async () => {
        global.fetch.mockResolvedValue(respond(503));
        const result = await checkUrlAvailability(url, { retries: 0, baseDelayMs: 0 });
        expect(result.error).toBe(`Error fetching "${url}". Response code is 503`);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('waits longer before each retry (exponential backoff)', async () => {
        const delays = [];
        const timeout = jest.spyOn(global, 'setTimeout').mockImplementation((callback, ms) => {
            delays.push(ms);
            callback();
            return 0;
        });
        global.fetch.mockResolvedValue(respond(503));

        await checkUrlAvailability(url, { retries: 3, baseDelayMs: 1000 });

        timeout.mockRestore();
        expect(delays).toEqual([1000, 2000, 4000]);
    });
});
