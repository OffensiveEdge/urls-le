import type { Configuration, ValidationResult } from '../types'
import { validateUrl } from './urlValidation'

export async function validateUrls(
  urls: string[],
  config: Configuration,
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = []

  for (const url of urls) {
    try {
      const result = await validateUrl(url, {
        timeout: config.validationTimeout,
        followRedirects: config.validationFollowRedirects,
      })
      results.push(result)
    } catch (error) {
      results.push({
        url,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return results
}
