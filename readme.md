# ``/mail/null``
Tired of accidentally sending test mails from your development environment to real addresses?

Meet `/mail/null`, a dummy SMTP server for development. Instead of relaying messages it renders them in a simple web interface for easy browsing.

[![Dependency Status](https://david-dm.org/jmosbech/mail-null.png)](https://david-dm.org/jmosbech/mail-null)

## Installation
```
npm install -g mail-null
```
## Start
```
mail-null
```

## Configuration
The server listens for connections on port 2525 (SMTP) and 3000 (HTTP).
This can be overridden by setting the environment variables `SMTP_PORT` and `PORT`.

## License
MIT
