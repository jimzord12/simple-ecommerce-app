# Project e-commerce-app

This is a very simple e-commerce example project.

Technologies used:

- Database: **PostgreSQL**
- Web Server: **Go http/net + chi**
- Frontend: **Next.js 14 (Typescript)**

## Getting Started

1. Create an empty directory (folder).
2. Navigate there using your terminal.
3. Copy and paste this command to download the project's code:

```
git clone https://github.com/jimzord12/simple-ecommerce-app.git
```

4. Next, you to need navigate to the "e-commerce-app" directory. Copy and paste this to the terminal:

```
cd ./backend/e-commerce-app
```

5. Now, you need to download the project's dependecies, to do so run this:

```
go mod tidy
```

6. Finally, enter the following command to run the App:

```
make run
```

## ⚠ Important - Add .env to `.gitignore`

In the following directory:

```
simple-ecommerce-app/backend/e-commerce-app
```

Find and Open a file named `.gitignore` and uncomment **line 26**, `.env` files usually contain private variables and should NOT be uploaded to a remote repository for security reasons.

## MakeFile

run all make commands with clean tests

```bash
make all build
```

build the application

```bash
make build
```

run the application

```bash
make run
```

Create DB container

```bash
make docker-run
```

Shutdown DB container

```bash
make docker-down
```

live reload the application

```bash
make watch
```

run the test suite

```bash
make test
```

clean up binary from the last build

```bash
make clean
```
