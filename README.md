# Secrets Encrypt

A helper utility for a really opinionated way of setting up your projects config.

We assume that you have the following setup

    ├── project/
    │   ├── configkey.js    
    │   ├── start.js
    │   ├── environments/
    │   │   ├── appA.js
    │   │   ├── appB.js
    │   │   ├── parts/
    │   │   │   ├── secrets.js
    │   │   │   ├── secrets.enc.js
    │   │   │   ├── common.js

The start script `start.js` using a a build variable say `BUILd` should be set to `appA` or `appB` which are then loaded from the `environments/appA.js` or `environments/appB.js` using `require`. These files themselves should depend on common config in for example `parts/common.js` and in particular, in the case of credentials should load them from `secrets.js`.

During encryption/decryption a key is used which can be defined through either a file or another environmental variable.

## Usage

### Install

```bash
npm i secrets-encrypt -S
```

Add the following in your `package.json`:

```JSON
"scripts": {
    "encrypt": "node secrets-encrypt",
    "decrypt": "node secrets-encrypt"
}
```

Add the following to `.gitignore`:
```
secrets.js
configkey.js
```

For local development you should create a `configkey.js` should be used, here's a template:
```js
/**
 *  Config key for decrypting sensitive environment config
 *  Do not store in repo!
 */

module.exports = 'yourSecretKey';
```

`configkey.js` is suitable for local development, however for production environments where its difficult to have files that are not checked into the repository you can set the environment variable `CONFIGKEY`.

### Running

Add a file in your

Encrypt / decrypt your secrets file.

```bash
npm run encrypt
```

```bash
npm run decrypt
```

expects:
* "secrets.js" in `environments/parts/secrets.js` during encrypt
* "secrets.enc.js" in `enviroments/parts/secrets.enc.js` during decrypt
* one of the following methods of providing a key:
    * `CONFIGKEY` environment variable
    * `configkey.js` file in the root of the project

# Motivation and benefits

This config setup maybe goes against everything you know about setting up configuration. You probably store all of your config in a separate place and/or you never check it into the repository. In addition the config is probably written in some format that is not native to Node.js.

While I agree with most of the tenants of the 12 factor app I find the complexity of replicating and editing config that goes with my applications when they are stored in files that don't lend themselves to all the benefits of modern node.js to be an incredible burden. These include:

- having to use a preprocessor to convert into a native js object
- having to use different config files for runtime environments (like a dotenv file for local dev and something else for production)
- having to repeat myself constantly
- does not lend itself to self-documentation, and the ability to include comments is seldom possible.

For this reason I tend to specify all my application config through plain js files but encrypt application secrets and allow choosing of one build or another through an environmental variable.
