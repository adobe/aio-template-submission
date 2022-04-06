import * as core from '@actions/core'
import fetch from 'node-fetch';

const myArgs = process.argv.slice(2);
const creator = myArgs[0];

fetch('https://api.github.com/orgs/adobe/teams/devx-services/memberships/' + creator)
  .then(response => response.json())
  .then(data => {
    if(data.state == "active") {
      console.log('Creator of remove-template issue is an admin.')
    } else {
      let errorMessage = 'Creator of remove-template issue is not an admin.'
      core.setOutput('error', ':x: ' + errorMessage)
      throw new Error(errorMessage)
    }
  })
