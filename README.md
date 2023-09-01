# Foxy URL Shortener

---

![foxy url shortener home](/assets/foxy-home.png)

This is a Node.js project that acts as a URL shortener, allowing users to register and shorten a URL. The project also gathers information about the user to whom the link is shared with. Here's how to use the project:

## Prerequisites

Basic knowledge of Node.js.
A text editor, preferably VS Code.

## Getting Started

Clone the repository to your local machine.
create a `.env` file in the root **or** add `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` to environment variable
Install the dependencies using `npm install`.
Start the server using `npm start` **or** dev server with `npm run dev`.

## Routes

- _/spoof_:
  Login page
- _/spoof/register_:
  Sign Up page
- _/spoof/dashboard_:
  Dashboard (post login)
- _/redirect_:
  For redirecting users
