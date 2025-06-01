import fs from 'fs'
import path from 'path'

type DatasetChar = {
  id: string
  name: string
  roleType: string
  print: string
  icon: string
  version: string
  isDisabled: boolean
}

const datasetPath = path.join(__dirname, '../src/logic/dataset.json')
const outputPath = path.join(__dirname, '../src/logic/dataset-types.ts')

const data = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'))
const ids = data.map((c: DatasetChar) => c.id)
const idNameMap = Object.fromEntries(data.map((c: DatasetChar) => [c.id, c.name]))
const editions = data.map((c: DatasetChar) => c.version.replace(/^[\da-zA-Z]+ ?- /, '')) // Remove prefix like "1 - ", "2 - ", etc.
const uniqueEditions = Array.from(new Set(editions)).sort()
const teams = data.map((c: DatasetChar) => c.roleType)
const uniqueTeams = Array.from(new Set(teams)).sort()

const idAliases = { scarlet_woman: 'scarletwoman' }

ids.push(...Object.keys(idAliases))
const idNameMapWithAliases = {
  ...idNameMap,
  ...Object.fromEntries(
    Object.entries(idAliases).map(([alias, original]) => [alias, idNameMap[original]]),
  ),
}

const typeDef = `// This file is auto-generated. Do not edit manually.
export type Character = ${ids.map((id) => `'${id}'`).join(' | ')};

export type Edition = ${uniqueEditions.map((e) => `'${e}'`).join(' | ')}

export type Team = ${uniqueTeams.map((t) => `'${t}'`).join(' | ')}

export type DatasetChar = {
  id: string
  name: string
  roleType: string
  print: string
  icon: string
  version: string
  isDisabled: boolean
}

export const idAliases = ${JSON.stringify(idAliases)};

export const idNameMap: Record<Character, string> = ${JSON.stringify(idNameMapWithAliases, null, 2)};
`

fs.writeFileSync(outputPath, typeDef)
console.log('Character type generated!')
