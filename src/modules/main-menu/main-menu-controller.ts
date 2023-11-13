import { env, loadEnv } from '../../config/env.js'
loadEnv()
import { InlineKeyboard, Keyboard } from 'grammy'
import { PretikContext } from '../../types/index.js'

const { CHANNEL_URL } = env

export const menuKeyboardLabels = {
  sendOffer: 'Запропонувати 📥',
  getStatus: 'Перевірити статус ініціативи 🔍',
  getStatistic: 'Статистика 📈',
  goToChannel: 'Глипнути на канал 👀',
}

export const visitChannelInline = new InlineKeyboard().url('Тицяй', CHANNEL_URL)

export const mainMenuKeyboard = new Keyboard()
  .text(menuKeyboardLabels.sendOffer)
  .text(menuKeyboardLabels.getStatus)
  .row()
  .text(menuKeyboardLabels.getStatistic)
  .text(menuKeyboardLabels.goToChannel)
  .resized()
  .persistent()

export const sendMenu = (ctx: PretikContext) =>
  ctx.reply('Ну шо, ґаздуємо! Що ти там придумав сьогодні?', {
    reply_markup: mainMenuKeyboard,
  })
