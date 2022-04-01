import * as core from '@actions/core'
import fetch from 'node-fetch';

const myArgs = process.argv.slice(2);
const creator = myArgs[0];
const npmLink = "https://www.npmjs.com/package/" + myArgs[1];

fetch('https://api.github.com/repos/adobe/aio-template-submission/issues?state=closed&labels=add-template&creator=' + creator)
  .then(response => response.json())
  .then(data => {
    if(data.length == 0) {
      let errorMessage = 'No add-template issues submitted by creator found.'
      core.setOutput('error', ':x: ' + errorMessage)
      throw new Error(errorMessage)
    } else {
      let found = data.find(element => element.body.includes(npmLink))
      if(found == undefined) {
        let errorMessage = 'Matching add-template issue for removal request by creator not found.'
        core.setOutput('error', ':x: ' + errorMessage)
        throw new Error(errorMessage)
      } else {
        console.log('Github add-template issue by creator found: ' + found.url)
      }
    }
  })
