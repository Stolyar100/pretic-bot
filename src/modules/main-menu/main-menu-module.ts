import { Composer } from 'grammy'
import {
  mainMenuKeyboard,
  sendMenu,
  visitChannelInline,
} from './main-menu-controller.js'
import { PretikContext } from '../../types/index.js'
import { isPrivateChat } from '../../helpers/filters.js'
export { menuKeyboardLabels, sendMenu } from './main-menu-controller.js'

const MainMenuModule = new Composer<PretikContext>()

MainMenuModule.command('menu', (ctx) => sendMenu(ctx))

MainMenuModule.filter(isPrivateChat).hears(
  'Глипнути на канал 👀',
  async (ctx) =>
    ctx.reply('Вперед!', {
      reply_markup: visitChannelInline,
    })
)

export { MainMenuModule, mainMenuKeyboard }
