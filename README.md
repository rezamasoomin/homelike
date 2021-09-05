
# HomeLike Assignment

This project is HomeLike Backend (NodeJs) Assignment

## Tech Stack

**Server:** Node, Express

**Database:** MongoDB

**Test:**  Jest

**Documentation:** apidoc
## Installation

Install with npm

```bash
  npm install
```
    
## Environment Variables

To run this project, you should update the following environment variables to your .env file

`DATABASE_URI`

`DATABASE_NAME`

`TEST_DATABASE_URI`

`TEST_DATABASE_NAME`

`JWT_SECRET`
  
## Running Tests

To run tests, run the following command

```bash
npm  test
```

  
## Deployment

To start this project in production mode run this command

```bash
npm start
```

## Documentation


To create documents and run it
  ```bash
 apidoc -i apps/ -o apidoc/
```
  ```bash
 cd  apidoc
```
  ```bash
 http-server
```
