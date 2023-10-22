import { env, loadEnv } from './config/env.js'
loadEnv()
import { Bot } from 'grammy'
import { MainMenuModule } from './modules/main-menu-module.js'

const { BOT_TOKEN } = env

const pretikBot = new Bot(BOT_TOKEN)

pretikBot.use(MainMenuModule)

pretikBot.command('start', (ctx) => ctx.reply('Hello World'))
pretikBot.on('message', (ctx) => ctx.reply('Ну ти страшний спеціаліст, Міша!'))

pretikBot.start()
