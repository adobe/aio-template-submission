import * as core from '@actions/core';
import * as metadata from '@adobe/aio-lib-template-validation';

(async () => {
  console.log('Check started');
  const myArgs = process.argv.slice(2);
  const path = myArgs[0];
  console.log(path);
  const results = await metadata.checkTemplateMetadata(path);
  try {
  } catch (e) {
    core.setOutput('error', `:x: ${e.message}`);
    throw e;
  }

  if (results.stats.failures !== 0) {
    let errors = [];
    for (const test of results.failures) {
      errors.push(`:x: ${test.message}`);
    }
    let errorMessage = errors.join('\n');
    core.setOutput('error', `${errorMessage}`);
    throw new Error(errorMessage);
  }
})();
