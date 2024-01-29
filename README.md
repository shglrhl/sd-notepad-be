
## Dev environment setup

1. Install all npm packages

    ```bash
    pnpm i
    ```

2. Rename .env.sample to .env and add the PostgreSQL dataconnection url and JWT secret

3. Run the following to generate & migrate the database.

    ```bash
    pnpm prisma:generate
    pnpm prisma migrate dev
    ```

4. Run local dev server

    ```bash
    pnpm start:dev
    ```

## Auto-generate Swagger config on changing the API

```bash
  pnpm swagger
```

 [Swagger auto-gen](https://swagger-autogen.github.io/docs/) builds out the general documentation, but you might need to take a look at adding swagger comments to help define it out.

## Testing

Testing is done using jest and supertest. Run the following command to run tests.

```bash
  pnpm test
```
