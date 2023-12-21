import { Composer } from 'grammy'

const UtilsModule = new Composer()

UtilsModule.command('id', (ctx) => ctx.reply(`${JSON.stringify(ctx.chat)}`))

export { UtilsModule }
