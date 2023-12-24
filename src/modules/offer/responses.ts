import { InlineKeyboard, Keyboard } from 'grammy'
import { PretikContext } from '../../types/index.js'
import { offerMenuData } from './offer-controller.js'
import { OfferStatus, Prisma } from '@prisma/client'
const departments = [
  'ІТ',
  'Маркетинг',
  'Департамент розвитку',
  'Обслуговування',
  'Правове питання',
  'Персонал',
  'В сусіднє село',
] as const

export const cancelButtonText = 'Йой, нє'
export const editButtonText = 'Йой, шось не то! Вернутись'
export const submitButtonText = 'Файно є'

export const cancelButtonRow = [[Keyboard.text(cancelButtonText)]]
export const editButtonRow = [[Keyboard.text(editButtonText)]]
export const submitButtonRow = [[Keyboard.text(submitButtonText)]]

export const cancelKeyboard = Keyboard.from(cancelButtonRow).resized()
export const departmentKeyboard = Keyboard.from(
  departments.map((departmentLabel) => [Keyboard.text(departmentLabel)])
)
  .resized()
  .toFlowed(2)
  .append(cancelKeyboard)
export const editSubmitKeyboard = Keyboard.from([
  ...editButtonRow,
  ...submitButtonRow,
])
  .resized()
  .toFlowed(2)
  .append(cancelKeyboard)

export const offerDraftMap: PretikContext['session']['offerDraft'] = {
  content: 'Зміст',
  reasons: 'Передумови',
  responsibleDepartment: 'В чий город',
  shortName: 'Коротка назва',
  solvesProblem: 'Вирішує проблему',
} as const

export const offerFieldLabels = Object.values(offerDraftMap)

export const selectOfferFieldKeyboard = Keyboard.from(
  offerFieldLabels.map((offerFieldLabel) => [Keyboard.text(offerFieldLabel)])
)
  .resized()
  .toFlowed(2)
  .append(cancelKeyboard)

export const offerLimitWarning =
  'Побійся Бога, пізніше побалакаєм! На сьогодні досить, продовжиш завтра, іди працюй'

export function _renderOfferMessage(
  offerDraft: PretikContext['session']['offerDraft']
) {
  const offerMessage = `
      Пропозиція📥 
  
      <b><i>${offerDraft.shortName}</i></b>
  
      <b>Передумови/причини/обгрунтування:</b> 
      ${offerDraft.reasons}
  
      <b>Зміст:</b> 
      ${offerDraft.content}
      
      <b>Яку проблему це вирішить або що покращить?:</b> 
      ${offerDraft.solvesProblem}
      
      <b>Ну і в чий город цей камінь?:</b> 
      ${offerDraft.responsibleDepartment}`

  return _deleteCodeIndentation(offerMessage).trim()
}

function _deleteCodeIndentation(text: string) {
  return text.replace(/[^\S\r\n][^\S\r\n]+/g, '')
}

export const offerNotFoundText = 'Йой, нема такої пропозиції на розгляді'
export const offerAcceptedText = 'Файно є, публікуєм'
export const offerRejectedText = 'Йой, геть тото'

const offerAcceptText = 'Публікувати'
const offerRejectText = 'Відхилити'

export function _generateOfferInline(offerId: offerMenuData['id']) {
  const acceptData: offerMenuData = {
    id: offerId,
    name: 'OfferStatus',
    action: 'ACCEPT',
  }
  const rejectData: offerMenuData = {
    id: offerId,
    name: 'OfferStatus',
    action: 'REJECT',
  }

  const acceptButtonPayload = JSON.stringify(acceptData)
  const rejectButtonPayload = JSON.stringify(rejectData)

  const offerInlineKeyboard = new InlineKeyboard()
    .text(offerAcceptText, acceptButtonPayload)
    .text(offerRejectText, rejectButtonPayload)

  return offerInlineKeyboard
}

export const requiresAdminText = 'А ти точно адмін?'

export function _generateStatistic(
  pendingCount = 0,
  rejectedCount = 0,
  acceptedCount = 0
) {
  return `На розгляді 🔄: ${pendingCount} \nПрийнято ✅: ${acceptedCount} \nВідхилено ❌: ${rejectedCount}`
}

export const offerPreviousText = '⬅️ Назад'
export const offerNextText = 'Вперед ➡️'
export const offerCloseText = 'Закрити ❌'
export const paginationLimitText = 'Чшшш, тихо'

const OfferMenuStatusText: Record<OfferStatus, (shortName: string) => string> =
  {
    PENDING: (shortName) => `🔄 На розгляді - ${shortName} `,
    ACCEPTED: (shortName) => `✅ Прийнято - ${shortName}`,
    REJECTED: (shortName) => `❌ Відхилено - ${shortName}`,
  }

export function _generateStatus(
  offerStatus: Prisma.OfferGetPayload<{
    select: { shortName: true; status: true }
  }>[],
  page: number,
  pagesCount: number
) {
  const statusString = offerStatus
    .map(({ shortName, status }) => OfferMenuStatusText[status](shortName))
    .join('\n')

  const statusMessage = `
    Твої пропозиції ${page + 1}/${pagesCount}:

    ${statusString}
    
    `
  return _deleteCodeIndentation(statusMessage)
}

export const offerUpdateNotification: Record<
  Exclude<OfferStatus, 'PENDING'>,
  (shortName: string) => string
> = {
  ACCEPTED: (shortName) =>
    `Привіт! PRETik на зв'язку. Маю новини! Статус твоєї ініціативи «${shortName}» змінився на «Прийнято». Ну ти страшний спеціаліст. Люкс! Давай ще!`,
  REJECTED: (shortName) =>
    `Привіт! PRETik на зв'язку. Маю новини! Статус твоєї ініціативи «${shortName}» змінився на «Відхилено».  А най їх качка копне! Фортуна сьогодні повернулась не тим боком, ну нічого, наступного разу пощастить. Все одно, ти – молодець! Вірю в те, що ти ще до мене повернешся! До зустрічі!`,
}
