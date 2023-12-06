import { Keyboard } from 'grammy'
import { PretikContext } from '../../types/index.js'
const departments = [
  'ІТ',
  'Маркетинг',
  'Департамент розвитку',
  'Обслуговування',
  'Правове питання',
  'Персонал',
  'В сусіднє село',
] as const

export const departmentKeyboard = Keyboard.from(
  departments.map((departmentLabel) => [Keyboard.text(departmentLabel)])
)
  .resized()
  .toFlowed(2)

export const cancelButtonText = 'Йой, нє'
export const editButtonText = 'Йой, шось не то! Вернутись'
export const submitButtonText = 'Файно є'

export const cancelButtonRow = [[Keyboard.text(cancelButtonText)]]
export const editButtonRow = [[Keyboard.text(editButtonText)]]
export const submitButtonRow = [[Keyboard.text(submitButtonText)]]

export const cancelKeyboard = Keyboard.from(cancelButtonRow).resized()
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