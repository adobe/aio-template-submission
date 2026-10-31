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

const DEFAULT_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 1000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Whether a response code is worth trying again. A server error, a timeout or a rate limit
 * can pass on the next try; a 404 will not.
 *
 * @param {number} status HTTP response code
 * @returns {boolean}
 */
function isRetryableStatus(status) {
    return status === 408 || status === 429 || status >= 500;
}

/**
 * Fetch a url once.
 *
 * @param {string} url Url link
 * @returns {Promise<{available: boolean, error: string, retryable: boolean}>}
 */
async function attemptFetch(url) {
    try {
        const response = await fetch(url);
        if (response.status === 200) {
            return { available: true, error: '', retryable: false };
        }
        return {
            available: false,
            error: `Error fetching "${url}". Response code is ${response.status}`,
            retryable: isRetryableStatus(response.status)
        };
    } catch (e) {
        return {
            available: false,
            error: `Error occurred during fetching "${url}". ${e.message}`,
            retryable: true
        };
    }
}

/**
 * Check Url availability. A network error, a 408, a 429 or a 5xx response is tried again with
 * exponential backoff, so one bad moment does not report a template as gone.
 * Any other response is final.
 *
 * @param {string} url Url link
 * @param {object} [options] options
 * @param {number} [options.retries] how many times to retry after the first attempt
 * @param {number} [options.baseDelayMs] wait before the first retry, doubled for each one after
 * @returns {Promise<{available: boolean, error: string}>}
 */
async function checkUrlAvailability(url, { retries = DEFAULT_RETRIES, baseDelayMs = DEFAULT_BASE_DELAY_MS } = {}) {
    let attempts = 0;
    let outcome;
    do {
        if (attempts > 0) {
            await sleep(baseDelayMs * 2 ** (attempts - 1));
        }
        attempts++;
        outcome = await attemptFetch(url);
    } while (!outcome.available && outcome.retryable && attempts <= retries);

    if (outcome.available) {
        return { available: true, error: '' };
    }
    const suffix = attempts > 1 ? ` Gave up after ${attempts} attempts.` : '';
    return { available: false, error: `${outcome.error}${suffix}` };
}

module.exports = {
    checkUrlAvailability
};
