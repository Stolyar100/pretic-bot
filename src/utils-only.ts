import { Bot } from 'grammy'
import { UtilsModule } from './modules/utils/utils-module.js'

const token = process.env.BOT_TOKEN || ''

const utilsOnly = new Bot(token)
utilsOnly.use(UtilsModule)

void utilsOnly.start()
