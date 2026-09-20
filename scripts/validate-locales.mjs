#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const localesDir = path.join(projectRoot, 'locales')
const baseName = 'en'

const flatten = (value, prefix = '', output = new Map()) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, output))
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      flatten(item, prefix ? `${prefix}.${key}` : key, output)
    })
  } else {
    output.set(prefix, value)
  }
  return output
}

const placeholders = (value) =>
  [...String(value).matchAll(/\{([^{}]+)\}/g)].map((match) => match[1]).sort()

const loadLocale = (name) => {
  const filename = path.join(localesDir, `${name}.json`)
  return JSON.parse(fs.readFileSync(filename, 'utf8'))
}

const requested = process.argv.slice(2)
const targets = requested.length
  ? requested
  : fs.readdirSync(localesDir)
      .filter((filename) => filename.endsWith('.json') && !['en.json', 'languages.json'].includes(filename))
      .map((filename) => path.basename(filename, '.json'))

const base = flatten(loadLocale(baseName))
let failed = false

for (const targetName of targets) {
  const target = flatten(loadLocale(targetName))
  const errors = []

  for (const [key, baseValue] of base) {
    if (!target.has(key)) {
      errors.push(`missing key: ${key}`)
      continue
    }
    const targetValue = target.get(key)
    if (typeof targetValue !== typeof baseValue) {
      errors.push(`type mismatch: ${key}`)
    }
    if (placeholders(targetValue).join('|') !== placeholders(baseValue).join('|')) {
      errors.push(`placeholder mismatch: ${key}`)
    }
  }

  for (const key of target.keys()) {
    if (!base.has(key)) errors.push(`unexpected key: ${key}`)
  }

  if (errors.length) {
    failed = true
    console.error(`${targetName}: ${errors.length} error(s)`)
    errors.forEach((error) => console.error(`  - ${error}`))
  } else {
    console.log(`${targetName}: OK (${target.size} values)`)
  }
}

process.exitCode = failed ? 1 : 0
