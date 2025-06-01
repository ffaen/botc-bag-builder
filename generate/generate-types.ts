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
const editions = data.map((c: DatasetChar) => c.version.replace(/^[\da-zA-Z]+ ?- /, '')) // Remove prefix like "1 - ", "2 - ", etc.
const uniqueEditions = Array.from(new Set(editions)).sort()
const teams = data.map((c: DatasetChar) => c.roleType)
const uniqueTeams = Array.from(new Set(teams)).sort()

const idAliases = { scarlet_woman: 'scarletwoman' }

ids.push(...Object.keys(idAliases))

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
`

fs.writeFileSync(outputPath, typeDef)
console.log('Character type generated!')
