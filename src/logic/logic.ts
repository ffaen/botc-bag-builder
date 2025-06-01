import { type DatasetChar } from '@/logic/dataset-types'
import { type Character } from '@/logic/dataset-types'
import { idAliases } from '@/logic/dataset-types'
import dataset from '@/logic/dataset.json'

export type HomebrewCharacterId = string

type ReleasedEdition =
  | 'Trouble Brewing'
  | 'Bad Moon Rising'
  | 'Sects and Violets'
  | 'Kickstarter Experimental'
  | 'Fabled'

type UnreleasedEdition = 'Unreleased Experimental'

type Edition = ReleasedEdition | UnreleasedEdition | 'Homebrew / Unknown'

type BoxPick = ReleasedEdition | 'Substitute'

type MetaObject = {
  id: '_meta'
  [key: string]: unknown
}

type HomebrewCharacter = {
  id: HomebrewCharacterId
  name: string
  [key: string]: unknown
}

type BagMap = { [key in Character]: Edition }

export type ParsedScript = Partial<{ [key in BoxPick]: (Character | HomebrewCharacterId)[] }>

const characterEditionMap: BagMap = Object.fromEntries(
  dataset
    .filter((char: DatasetChar) => !!char.id && !!char.version)
    .map((char: DatasetChar) => {
      // Remove prefix like "1 - " or "3a - " from version
      const cleanEdition = char.version.replace(/^[\da-zA-Z]+ ?- /, '') as Edition
      return [char.id, cleanEdition]
    }),
) as BagMap

// Add aliases for characters that have different names in the dataset using idAliases
for (const [alias, original] of Object.entries(idAliases)) {
  if (original in characterEditionMap) {
    characterEditionMap[alias as Character] = characterEditionMap[original as Character]
  } else {
    console.warn(`Alias "${alias}" points to unknown character "${original}".`)
  }
}

const travellers: Character[] = dataset
  .filter((char: DatasetChar) => char.roleType === 'traveller')
  .map((char: DatasetChar) => char.id as Character)

export type Script = (Character | HomebrewCharacter | MetaObject)[]

/**
 * Groups an array of character names or homebrew character objects by their Edition.
 * @param characters Array of Character, HomebrewCharacter, or MetaObject
 * @returns Object: { [Edition]: (Character | HomebrewCharacter)[] }
 */
export function groupCharactersByEdition(characters: Script) {
  const editionMap: { [key in Edition]?: (Character | HomebrewCharacterId)[] } = {}

  for (const char of characters) {
    // Ignore meta objects
    if (typeof char === 'object' && char.id === '_meta') continue

    // Homebrew character object or object with id
    if (typeof char === 'object') {
      // If id matches a known character, treat as that character
      if (char.id && typeof char.id === 'string' && char.id in characterEditionMap) {
        const edition = characterEditionMap[char.id as Character] ?? 'Homebrew / Unknown'
        if (!editionMap[edition]) editionMap[edition] = []
        editionMap[edition]!.push(char.id)
        continue
      }
      // Otherwise treat as homebrew
      if (!editionMap['Homebrew / Unknown']) editionMap['Homebrew / Unknown'] = []
      editionMap['Homebrew / Unknown']!.push(char.id)
      continue
    }

    // Character string
    const edition = characterEditionMap[char as Character] ?? 'Homebrew / Unknown'
    if (!editionMap[edition]) editionMap[edition] = []
    editionMap[edition]!.push(char)
  }

  return editionMap
}

export function editionMapping(hasKickstarter: boolean): { [key in Edition]: BoxPick } {
  return {
    'Trouble Brewing': 'Trouble Brewing',
    'Bad Moon Rising': 'Bad Moon Rising',
    'Sects and Violets': 'Sects and Violets',
    'Kickstarter Experimental': hasKickstarter ? 'Kickstarter Experimental' : 'Substitute',
    'Unreleased Experimental': 'Substitute',
    Fabled: 'Fabled',
    'Homebrew / Unknown': 'Substitute',
  }
}

export function parseScript(script: Script, hasKickstarter: boolean): ParsedScript {
  const editions = groupCharactersByEdition(script)

  // remap the editions to BoxPick and then group everything again
  const editionMap = editionMapping(hasKickstarter)

  // Initialize boxPicks as a blank object with no keys
  const boxPicks: Partial<{ [key in BoxPick]: (Character | HomebrewCharacterId)[] }> = {}

  for (const edition in editions) {
    const boxPick = editionMap[edition as Edition]
    if (!boxPicks[boxPick]) boxPicks[boxPick] = []
    boxPicks[boxPick].push(...editions[edition as Edition]!)
  }

  return boxPicks
}
export function isTraveller(char: Character): boolean {
  // if the character is in the travellers list, return true
  return travellers.includes(char)
}

export function suggestSubstitutions(script: ParsedScript): { [key in Character]?: Character } {
  if (!script['Substitute']) return {}

  const substitutions: { [key in Character]?: Character } = {}

  // Collect all characters already in the script (flatten all arrays)
  const usedCharacters = new Set(
    Object.values(script)
      .flat()
      .filter((c): c is Character => typeof c === 'string'),
  )

  // Track which characters have been suggested as substitutions to avoid duplicates
  const suggested = new Set<Character>()

  for (const char of script['Substitute']) {
    // Find the DatasetChar for the substituted character
    const charData = dataset.find((c: DatasetChar) => c.id === char)
    if (!charData) continue

    // Find possible substitutions
    const possibleSubs = dataset
      .filter(
        (candidate: DatasetChar) =>
          candidate.id !== char && // not the same character
          !usedCharacters.has(candidate.id as Character) && // not already used
          !suggested.has(candidate.id as Character) && // not already suggested
          candidate.roleType === charData.roleType && // same alignment
          !candidate.isDisabled, // not disabled
      )
      .map((c: DatasetChar) => c.id as Character)

    if (possibleSubs.length > 0) {
      const firstSub = possibleSubs[0]
      substitutions[char as Character] = firstSub
      suggested.add(firstSub)
    }
  }

  return substitutions
}
