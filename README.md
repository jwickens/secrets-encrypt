# Secrets Encrypt

A helper utility for a really opinionated way of setting up your projects config.

We assume that you have the following setup

    ├── project/
    │   ├── start.js
    │   ├── environments/
    │   │   ├── appA.js
    │   │   ├── appB.js
    │   │   ├── parts/
    │   │   │   ├── secrets.js
    │   │   │   ├── secrets.enc.js
    │   │   │   ├── common.js

The start script `start.js` using a a build variable say `BUILd` should be set to `appA` or `appB` which are then loaded from the `environments/appA.js` or `environments/appB.js` using `require`. These files themselves should depend common config in `parts/common.js` or in the case of credentials should load them from `secrets.js`.


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
```

### Running

Encrypt / decrypt your secrets file.

```bash
npm run encrypt
```

```bash
npm run decrypt
```

expects "secrets.js" in `environments/parts/secrets.js` during encrypt
and "secrets.enc.js" in `enviroments/parts/secrets.enc.js` during decrypt
