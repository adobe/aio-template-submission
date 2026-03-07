<span align="center">

# Adobe App Builder Template Registry

</span>

Adobe App Builder Template Registry allows template developers to get their templates reviewed and endorsed by Adobe team.

## Benefits
* Increase the visibility of your template.
* Have your template discoverable via AIO CLI.
* Increase the level of trust end users place in your template.
* Have your template reviewed by Adobe team.

## Requirements
* The template must be published on NPM.
* The template must have a public GitHub repo.
* The template must successfully install and run on all Active LTS versions of Node.js.
* The template's tests must pass.
* The template's metadata must pass [aio-lib-template-validation](https://github.com/adobe/aio-lib-template-validation) checks.

## How to submit a template
If you would like your template reviewed and added to the registry, please open a [template review request](https://github.com/adobe/aio-template-submission/issues/new?assignees=&labels=add-template&template=verification-request.yml) in this repository and fill in the form. 
Template Registry will execute a set of checks and provide the feedback via issue comment.

## How to remove a template
If you decide you no longer wish to maintain your template and want to remove it from the registry, please open a [template removal request](https://github.com/adobe/aio-template-submission/issues/new?assignees=&labels=remove-template&template=remove-request.yml) in this repository and fill in the form.

## Security & Authorization

### Permission Model

For security reasons, template removal and updates require **admin privileges**.

**Why admin-only?**
- Prevents unauthorized modification of registry entries
- Ensures manual verification of package ownership
- Protects against account compromise
- Provides audit trail for all changes

### How to Request Changes

#### Removing Your Template
1. Open a [template removal request](https://github.com/adobe/aio-template-submission/issues/new?assignees=&labels=remove-template&template=remove-request.yml)
2. Provide proof of ownership (link to NPM package showing you as maintainer)
3. An admin will verify and process your request

#### Updating Your Template
1. Open a [template update request](https://github.com/adobe/aio-template-submission/issues/new?assignees=&labels=update-template&template=update-request.yml)
2. Provide the npm package name
3. An admin will verify ownership and process the update

### Proof of Ownership

When requesting removal or updates, please provide:
- Your NPM username
- Link to the NPM package page showing you as a maintainer
- Reason for the change

Example:
```
NPM username: my-npm-username
Package link: https://www.npmjs.com/package/@example/my-template
Maintainers list: npm owner ls @example/my-template
Reason: Package deprecated / no longer maintained / security update needed
```

### For Admins

Admins are defined in the `ALLOWLIST_ADMINS` repository variable (comma-separated list of GitHub usernames).

**Configuration**: See [GitHub documentation on repository variables](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables) for setup instructions.

#### Admin Procedure: Template Removal

**Step 1: Verify Ownership**

When a removal request is submitted, verify the requester owns the NPM package:

```bash
# Check NPM package maintainers
npm owner ls <package-name>

# Example output:
# username1 <email1@example.com>
# username2 <email2@example.com>
```

**Step 2: Cross-reference with Requester**

- Check if the requester's GitHub username matches any NPM maintainer username
- If usernames differ, verify the requester's NPM profile links to their GitHub:
  - Visit: `https://www.npmjs.com/~<npm-username>`
  - Check for GitHub link in profile
- If still unclear, ask requester to provide proof (e.g., publish a verification file to NPM)

**Step 3: Verify Legitimacy**

Check the request is legitimate:
- Review the reason for removal (deprecated, security issue, no longer maintained, etc.)
- Verify the package exists and matches the requester's claim
- Check for suspicious patterns (e.g., bulk removal requests, recently created accounts)

**Step 4: Process the Removal**

Once ownership is verified:

1. **Comment on the issue** with verification confirmation:
   ```
   ✅ Verified: @<username> is listed as maintainer of <package-name>
   Processing removal...
   ```

2. **Trigger the removal workflow** by commenting:
   ```
   /remove
   ```

3. **Monitor the workflow execution**:
   - Go to Actions tab → Template Removal workflow
   - Verify it completes successfully
   - The workflow will automatically:
     - Remove the template from `registry.json`
     - Commit the change
     - Close the issue with confirmation

**Step 5: Handle Failures**

If the workflow fails:
- Check the workflow logs for errors
- Verify your username is in the `ALLOWLIST_ADMINS` repository variable
- If needed, manually remove the entry from `registry.json` and commit

#### Admin Procedure: Template Update

Follow similar steps for update requests:

1. **Verify ownership** (same as removal)
2. **Trigger update** by commenting `/update` on the issue
3. **Monitor workflow** to ensure successful completion

#### Quick Reference

**Admin Commands:**
- `/remove` - Trigger template removal (admin-only)
- `/update` - Trigger template update (admin-only)

**Verification Commands:**
```bash
npm owner ls <package-name>          # List maintainers
npm view <package-name> --json       # Full package info
npm info <package-name> maintainers  # Maintainers only
```
