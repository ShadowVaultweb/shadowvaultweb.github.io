# ShadowVault Website

Official ShadowVault meme coin project showcase, built for GitHub Pages.

## Publish with GitHub Pages

1. Upload every file and folder in this package to the root of the `shadowvaultweb.github.io` repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and `/(root)` folder.
5. Click **Save**.

The website will be available at:

`https://shadowvaultweb.github.io`

## Update SCORN after launch

Open `script.js` and replace:

```js
contract: "Coming Soon",
pumpUrl: "",
status: "PRE-LAUNCH",
```

with the real contract, Pump.fun URL and a status such as `LIVE`.

## Add another project

In `script.js`, replace one of these:

```js
{ locked: true }
```

with a complete project object using SCORN as the example.

## Important

Never upload seed phrases, private keys, wallet files, passwords, API keys or `.env` files.
