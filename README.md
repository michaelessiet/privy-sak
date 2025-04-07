# Privy Solana Agent

## Overview

This is an example of a Solana agent built using the Solana Agent Kit V2 and the Privy SDK. The agent is designed to interact with the Solana blockchain and perform various tasks such as swapping tokens, signing transactions, and sending tokens.

## Installation

To install the required dependencies, run the following command:

```bash
pnpm install
```

## Configuration

To configure the agent, create a `.env.local` file in the root directory and copy the contents of the `.env.example` file into it. Then, fill in the required environment variables:

```env
cp .env.example .env.local
```

Fill out the `.env.local` file with the required variables. For the postgres URL I recommend using Supabase to create a Postgres database.

To create the `AUTH_SECRET` simply run `openssl rand -base64 32` in your terminal. This will generate a random string that you can use as the secret for authentication.

For the `VERCEL_BLOB_READ_OR_WRITE_TOKEN` reference this [doc](https://vercel.com/docs/storage/vercel-blob)

### Database

To set up the database, run the following command:

```bash
pnpm db:generate
```

This will create the necessary tables and schema for the agent to function properly.

Now you can run the migrations to set up the database:

```bash
pnpm db:migrate
```

## Usage

To run the agent, use the following command:

```bash
pnpm dev
```

### Note

This is an example agent and is not intended for production use. It is recommended to review the code and make any necessary modifications before deploying it in a production environment. It is especially recommended to review the security aspects of the agent, such as authentication, secrets, and authorization, to ensure that it meets your security requirements.
