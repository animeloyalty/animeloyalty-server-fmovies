# AnimeLoyalty

This *AnimeLoyalty* server plugin adds support for *fmovies.to*.

## Legal Warning

This application is not endorsed or affliated with any streaming service. The usage of this application may be forbidden by law in your country. Usage of this application may cause a violation of *Terms of Service* between you and the streaming service. This application is not responsible for your actions.

# Install or Update

## Windows

1. Install *NodeJS* following the instructions at http://nodejs.org/
2. Run in *Command Prompt*: `npm install -g animeloyalty-server-fmovies`

## Mac

1. Install *NodeJS* following the instructions at http://nodejs.org/
2. Run in *Terminal*: `npm install -g animeloyalty-server-fmovies`

## Linux (Mint, Ubuntu, etc)

1. Run in *Terminal*: `sudo apt-get install nodejs npm`
2. Run in *Terminal*: `sudo npm install -g animeloyalty-server-fmovies`

# Usage

After installation, *fmovies.to* will appear in *AnimeLoyalty*.

## Solving ReCaptcha

The fmovies.to website can present a *ReCaptcha* validation. This is intended to determine whether a visitor is a human, or a bot. Like any other automation application, *AnimeLoyalty* cannot solve these. There are two options to get around the *ReCaptcha* validations:

1. **Solve the ReCaptcha yourself**. Because *AnimeLoyalty* allows you to access the browser context it uses for automation purposes, you can also use that browser context and solve the *ReCaptcha* yourself. Please note, the *ReCaptcha* validation triggers every hour, so you'll have to solve one at least every hour.
2. **Pay someone else to solve the ReCaptcha**. This plugin has support for *2captcha*, a paid service that solves *ReCaptcha* validations on your behalf. It's priced at 3 USD per 1000 solutions, so if you watch **4 hours** every day, you'll have to pay about 4 USD per year.

## Configure 2captcha

1. Navigate to [2captcha.com](https://2captcha.com?from=11353428) and sign up for an account.
2. Charge your account with a prepaid amount of 1 USD or more.
3. Copy the `API Key` from your account settings page.
4. Run `animeloyalty-2captcha key YOURAPIKEY`.
5. You can now watch fmovies.to in *AnimeLoyalty*. Enjoy!
