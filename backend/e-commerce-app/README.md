# The Backend

Technologies used:

- Database: **PostgreSQL**
- Web Server: **Go's http/net + chi**

## Getting Started

Regarding installing PostgreSQL and creating a Database read this: [PostgreSQL README](./internal/database/sql/README.md)

You will need to download and install the Go Programming Language [Official download](https://go.dev/doc/install)

> Wanna test the API using an API client? While developing I used [Bruno](https://www.usebruno.com/) a [Postman](https://www.postman.com/) Alternative. In the `backend/e-commerce-app/api_testing` are the Request collections.

Now we need to download the Backend's dependencies (aka, code other devs have written so that we don't have to 😁)

4. Navigate to the "e-commerce-app" directory. Copy and paste this to the terminal:

```
cd ./backend/e-commerce-app
```

5. To download the Deps, run this command:

```
go mod tidy
```

6. To run the App:

```
make run
```

## ⚠ Important - Add .env to `.gitignore`

In the following directory:

```
simple-ecommerce-app/backend/e-commerce-app
```

Find and Open a file named `.gitignore` and uncomment **line 26**, `.env` files usually contain private variables and should NOT be uploaded to a remote repository for security reasons.

## MakeFile - Commands

build the application

```bash
make build
```

run the application

```bash
make run
```

clean up binary from the last build

```bash
make clean
```
