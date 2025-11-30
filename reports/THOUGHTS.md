# Zephyr Cloud
This document shows my thoughts, as a senior software developer, first impressing the Zephyr's Cloud software and services for micro-frontends with Module Federation Architecture.

## Application deployed
> #### Main app:
> https://bernardo-henrique-156-mf-react-rsbuild-consumer-m-264681885-ze.zephyrcloud.app/
>
> #### Remote provider:
> https://bernardo-henrique-155-mf-react-rsbuild-provider-m-4294d2d78-ze.zephyrcloud.app/

## METHODOLOGY
At first, I took a look at Zephyr's initial page, and went through its Overview, Quickstart and Vite + Webpack + Rspack with Module Federation pages.

I initialized a new project using the npm tool "create-zephyr-apps".
Then I used cursor to explore the project architecture & understand the main funcionallities. Also, generated a README.md file with all the information I gathered.

Then, I went trough some troubleshooting using Cursor and pointing to Zephyr Cloud's official docs.

Finally, I managed to have my micro-frontend app running and deployed in Zephyr Cloud's service.

## HOW IT WORKS
Module Federation is a JavaScript application partitioning architecture pattern (similar to microservices on the server side) that allows you to share code and resources between multiple JavaScript applications (or micro frontends). As I have researched, it brings plenty of advantages - as well as some tradeoffs, of course - such as:
- *Code Sharing:* Module Federation allows developers to share code between multiple projects in a decentralized way, making it easier to manage complex applications.
- *Modularization:* Applications can be split into smaller, self-contained modules that can be independently developed, tested, and deployed.
- *Flexibility:* Module federation offers developers the freedom to choose and implement the architecture that best suits their needs.

The biggest tradeoffs for Module Federation (that actually comes from micro-frontends in general) are the overhead of managing the extra complexity of the projects theirselves, their deployments and also their codebases.

Zephyr Cloud, in its turn, brings some more extra advantages in its service based on Module Federation. Its agnostic about frameworks, bundlers and cloud providers, therefore being configurable in several different projects. Beoynd that, Zephyr gives you the power of its Default Cloud, with the largest CDNs network in the world and the easiest way to deploy.

Zephyr Cloud make it easy to deploy a micro-frontend app, with live previews and seamless deployment flows.

## COMMENTS & THOUGHTS
- NextJS is the main framework for ReactJS - also suggested in the ReactJS official page. But the thing is that now it uses Turbopack (previously Webpack) as its bundler, and it is still not supported by Zephyr Cloud. I think its something to be considered asap by Zephyr's developers team.

- Using create-zephyr-apps - template "React + Rsbuild + Module Federation" - is a really good experience. I just wanted to mention this here. Also, I think it deserves to be highlighted in the Quickstart page of Zephyr's docs. I only see its mention in the initial page (https://zephyr-cloud.io/).

## ISSUES

I had problems during the authentication flow to Zephyr Cloud in my first build. It got solved later on, but it looks like an race condition when the app is created by create-zephyr-apps. Check the Cursor logs:

🔐 Two Ways to Authenticate with Zephyr Cloud
Method 1: Interactive Browser Login (Those URLs)
When Zephyr shows:
ZEPHYR   https://auth.zephyr-cloud.io/authorize?response_type=code&...ZEPHYR   You can hit Enter to open it up on your browser.
How it's supposed to work:
> You press Enter in the terminal
> Browser opens to Zephyr login page
> You sign in (GitHub/Google/Email)
> Browser redirects with auth code
> Zephyr CLI captures the code and exchanges it for a token
> Token gets saved to ~/.zephyr/credentials.json
> Dev server continues without .env needed

Why it didn't work for you:
When running pnpm dev, both apps start simultaneously and both try to authenticate at the same time
This creates a race condition where the terminal is waiting for input from TWO processes
The authentication flow times out or gets confused
You saw: *No token found after authentication finished, did it timeout?*

## CONCLUSION

I enjoyed using Zephyr Cloud for micro-frontends built with Module Federation. It's really easy to start a project from scratch - special mention to create-zephyr-apps package - and put it online to Zephyr Cloud's services.

Module Federation heavily enhances web apps development by bringing all the micro-frontend advantages packed. I think Zephyr Cloud makes a huge difference on providing the necessary tools and services to deploy MF apps with ease and scale.

The fact of being agnostic about clouds, frameworks and bundlers makes Zephyr Cloud a powerful and robust choice, a must-have for teams working with micro-frontends and Module Federation.