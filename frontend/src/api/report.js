import service, { requestWithRetry } from './index'
import { currentLanguage } from '../i18n'

/** Reports follow the selected UI language unless the caller overrides it. */
const withLanguage = (data) => ({ language: currentLanguage(), ...data })

/**
 * Start report generation
 * @param {Object} data - { simulation_id, force_regenerate?, language? }
 */
export const generateReport = (data) => {
  return requestWithRetry(() => service.post('/api/report/generate', withLanguage(data)), 3, 1000)
}

/**
 * Get report generation status
 * @param {string} reportId
 */
export const getReportStatus = (reportId) => {
  return service.get(`/api/report/generate/status`, { params: { report_id: reportId } })
}

/**
 * Get Agent log (incremental)
 * @param {string} reportId
 * @param {number} fromLine - Start from which line
 */
export const getAgentLog = (reportId, fromLine = 0) => {
  return service.get(`/api/report/${reportId}/agent-log`, { params: { from_line: fromLine } })
}

/**
 * Get console log (incremental)
 * @param {string} reportId
 * @param {number} fromLine - Start from which line
 */
export const getConsoleLog = (reportId, fromLine = 0) => {
  return service.get(`/api/report/${reportId}/console-log`, { params: { from_line: fromLine } })
}

/**
 * Get report details
 * @param {string} reportId
 */
export const getReport = (reportId) => {
  return service.get(`/api/report/${reportId}`)
}

/**
 * Chat with Report Agent
 * @param {Object} data - { simulation_id, message, chat_history? }
 */
export const chatWithReport = (data) => {
  return requestWithRetry(() => service.post('/api/report/chat', withLanguage(data)), 3, 1000)
}
