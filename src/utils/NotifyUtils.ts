import { gooeyToast } from 'goey-toast'

type ShowContent = string
type ShowOptions = { timeout?: number }

const info = (content: ShowContent, options?: ShowOptions): void => {
  gooeyToast.info(content, { duration: options?.timeout || 5000 })
}

const success = (content: ShowContent, options?: ShowOptions): void => {
  gooeyToast.success(content, { duration: options?.timeout || 5000 })
}

const error = (content: ShowContent, options?: ShowOptions): void => {
  gooeyToast.error(content, { duration: options?.timeout || 5000 })
}

const warn = (content: ShowContent, options?: ShowOptions): void => {
  gooeyToast.warning(content, { duration: options?.timeout || 5000 })
}

const NotifyUtils = { info, success, error, warn }

export default NotifyUtils
