descrever o que é este documento

# METHOD
- i used cursor to explore the project architecture & understand the main funcionallities

# COMMENTS & THOUGHTS
- nextjs' official bundler is now Turbopack (previously Webpack) - its one of the officially recommended frameworks for ReactJS
- Zephyr doesnt supports Turbopack yet
- use create-zephyr-apps - template "React + Rsbuild + Module Federation" - really good dev experience

# CONCLUSION





# ISSUES

🔐 Two Ways to Authenticate with Zephyr Cloud
Method 1: Interactive Browser Login (Those URLs)
When Zephyr shows:
ZEPHYR   https://auth.zephyr-cloud.io/authorize?response_type=code&...ZEPHYR   You can hit Enter to open it up on your browser.
How it's supposed to work:
You press Enter in the terminal
Browser opens to Zephyr login page
You sign in (GitHub/Google/Email)
Browser redirects with auth code
Zephyr CLI captures the code and exchanges it for a token
Token gets saved to ~/.zephyr/credentials.json
Dev server continues without .env needed
Why it didn't work for you:
When running pnpm dev, both apps start simultaneously and both try to authenticate at the same time
This creates a race condition where the terminal is waiting for input from TWO processes
The authentication flow times out or gets confused
You saw: No token found after authentication finished, did it timeout?

I couldnt create a new project in zephyr cloud dashboard

