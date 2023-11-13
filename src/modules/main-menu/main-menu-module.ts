import { Composer, InlineKeyboard, Keyboard } from 'grammy'
import {
  mainMenuKeyboard,
  sendMenu,
  visitChannelInline,
} from './main-menu-controller.js'
import { PretikContext } from '../../types/index.js'
export { menuKeyboardLabels, sendMenu } from './main-menu-controller.js'
const MainMenuModule = new Composer<PretikContext>()

MainMenuModule.command('menu', (ctx) => sendMenu(ctx))

// MainMenuModule.hears('Перевірити статус ініціативи 🔍', (ctx) =>
//   ctx.reply('Міша, розділ *Перевірити статус ініціативи 🔍*, поки в розробці', {
//     parse_mode: 'MarkdownV2',
//   })
// )

// MainMenuModule.hears('Статистика 📈', (ctx) =>
//   ctx.reply('Міша, розділ *Статистика 📈*, поки в розробці', {
//     parse_mode: 'MarkdownV2',
//   })
// )

MainMenuModule.hears('Глипнути на канал 👀', async (ctx) =>
  ctx.reply('Вперед!', {
    reply_markup: visitChannelInline,
  })
)

export { MainMenuModule, mainMenuKeyboard }
