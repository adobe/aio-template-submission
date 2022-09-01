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

const { isAdobeRecommended } = require('../src/is-adobe-recommended');

describe('Verify templates are correctly identified as Adobe recommended', () => {
    test('Verify that @adobe template is recommended', () => {
        expect(isAdobeRecommended("@adobe/aio-template-example")).toBe(true);
    });

    test('Verify third-party template is not recommended', () => {
        expect(isAdobeRecommended("@company/aio-template-example")).toBe(false);
    });

    test('Verify third-party template under no org is not recommended', () => {
        expect(isAdobeRecommended("aio-template-example")).toBe(false);
    });
});
