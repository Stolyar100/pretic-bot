# PretikBot

This is a telegram bot designed to receive offers from employees, send them to specific group where users with permission can reject it or accept with automatic posting them to dedicated channel.

## Table of contents

- [Environment variables](#environment-variables)
- - [Required variables](#required-variables)
- - [Optional variables](#optional-variables)
- - [.env file example](#env-file-example)
- [How to Install and Run the Project](#how-to-install-and-run-the-project)
- - [Run helper bot instance](#run-helper-bot-instance)

## Environment variables

### Required variables

- `BOT_TOKEN` - Telegram Bot token given vy BotFather.
- `ADMINS_GROUP_ID` - Telegram Group Id where offers will be sent for proceeding.
- `CHANNEL_ID` - Telegram Channel Id where accepted offers will be published.
- `CHANNEL_INVITE_URL` - Invite link to the channel.
- `DATABASE_URL` - Your DB connection link.

### Optional variables

- `CONVERSATION_TIMEOUT` - Value in milliseconds to limit conversation input waiting time in **@grammyjs/conversations**
- `STORAGE_TIMEOUT` - Value in milliseconds to limit storage data living time in **@grammy/session**
- `OFFER_PER_PAGE` - Size of the pages in the offers' status menu.

### .env file example

You should end up with **.env** file looking like this:

```
BOT_TOKEN=6832556543:AAAV8a2gpQ1Zc5n7KrzR5asCodPe2qN08
CHANNEL_INVITE_URL=https://t.me/+EsMdM7ksvhsxNgay
CHANNEL_ID=-1002221554553
ADMINS_GROUP_ID=-1002095611114


DATABASE_URL=postgresql://user:password@localhost:5432/DB?schema=Dev
```

## How to Install and Run the Project

1. From root project folder, install dependencies:

   ```bash
   npm install
   ```

2. Compile typescript:

   ```bash
   npm build
   ```

3. Create and fill the .env file:

   ### Run helper bot instance:

   Since you can't run bot without required config variables, there is a dedicated bot instance, that provides you with `/id`command , which replies with chat info.

   **Consider the fact that** telegram chats usually start with `type: 'group'`, but will definitely change it to `type: 'supergroup'` along with getting new `id`. So it's preferebly to manually convert it(if still possible), or trigger this change(try switching _Topics_ on and off)

   To start helper instance run:

   ```bash
   npm run utils
   ```

4. Generate Prisma ORM Client:
   ```bash
   npx prisma generate
   ```
5. Run project:

   To run with hot reload:

   ```bash
       npm run dev
   ```

   To run without hot reload:

   ```bash
       npm start
   ```

   To run with process manager, point to `build/src/index.js`
