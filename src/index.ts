import { env, loadEnv } from './config/env.js'
loadEnv()
import { Bot } from 'grammy'

const { BOT_TOKEN } = env

const pretikBot = new Bot(BOT_TOKEN)

pretikBot.command('start', (ctx) => ctx.reply('Hello World'))

pretikBot.start()
