type Character =
  // Trouble Brewing (Trouble Brewing)
  | 'chef'
  | 'investigator'
  | 'washerwoman'
  | 'librarian'
  | 'empath'
  | 'fortuneteller'
  | 'undertaker'
  | 'monk'
  | 'ravenkeeper'
  | 'virgin'
  | 'slayer'
  | 'soldier'
  | 'mayor'
  | 'butler'
  | 'drunk'
  | 'recluse'
  | 'saint'
  | 'poisoner'
  | 'spy'
  | 'scarletwoman'
  | 'baron'
  | 'imp'
  // Bad Moon Rising (Bad Moon Rising)
  | 'grandmother'
  | 'sailor'
  | 'chambermaid'
  | 'exorcist'
  | 'innkeeper'
  | 'gossip'
  | 'gambler'
  | 'courtier'
  | 'professor'
  | 'minstrel'
  | 'sweetheart'
  | 'fool'
  | 'moonchild'
  | 'tinker'
  | 'goon'
  | 'lunatic'
  | 'godfather'
  | 'devilsadvocate'
  | 'assassin'
  | 'witch'
  | 'pukka'
  | 'shabaloth'
  | 'zombuul'
  | 'po'
  | 'pacifist'
  | 'matron'
  | 'judge'
  | 'apprentice'
  | 'voudon'
  | 'bishop'
  | 'mastermind'
  // Sects & Violets (Sects and Violets)
  | 'artist'
  | 'clockmaker'
  | 'dreamer'
  | 'flowergirl'
  | 'juggler'
  | 'mathematician'
  | 'seamstress'
  | 'towncrier'
  | 'savant'
  | 'philosopher'
  | 'oracle'
  | 'sage'
  | 'mutant'
  | 'barber'
  | 'klutz'
  | 'cerenovus'
  | 'vigormortis'
  | 'vortox'
  | 'fanggu'
  | 'snakecharmer'
  | 'sweetheart'
  | 'pithag'
  | 'eviltwin'
  | 'witch'
  | 'barista'
  | 'harlot'
  | 'butcher'
  | 'bonecollector'
  | 'deviant'
  // Experimental (Kickstarter Experimental, Unreleased Experimental)
| 'poppygrower'
| 'tealady'
  | 'steward'
  | 'knight'
  | 'noble'
  | 'shugenja'
  | 'pixie'
  | 'bountyhunter'
  | 'highpriestess'
  | 'balloonist'
  | 'general'
  | 'preacher'
  | 'villageidiot'
  | 'king'
  | 'cultleader'
  | 'alsaahir'
  | 'engineer'
  | 'nightwatchman'
  | 'huntsman'
  | 'alchemist'
  | 'cannibal'
  | 'amnesiac'
  | 'farmer'
  | 'fisherman'
  | 'acrobat'
  | 'lycanthrope'
  | 'choirboy'
  | 'banshee'
  | 'magician'
  | 'atheist'
  | 'golem'
  | 'ogre'
  | 'plaguedoctor'
  | 'hatter'
  | 'politician'
  | 'zealot'
  | 'damsel'
  | 'snitch'
  | 'heretic'
  | 'puzzlemaster'
  | 'mezepheles'
  | 'harpy'
  | 'fearmonger'
  | 'psychopath'
  | 'wizard'
  | 'widow'
  | 'xaan'
  | 'marionette'
  | 'summoner'
  | 'goblin'
  | 'boomdandy'
  | 'vizier'
  | 'organgrinder'
  | 'boffin'
  | 'yaggababble'
  | 'lilmonsta'
  | 'ojo'
  | 'kazali'
  | 'legion'
  | 'lordoftyphon'
  | 'lleech'
  | 'alhadikhia'
  | 'riot'
  | 'leviathan'
  | 'gangster'
  | 'gnome'
  // Travellers (Extras)
  | 'thief'
  | 'bureaucrat'
  | 'gunslinger'
  | 'beggar'
  | 'scapegoat'
  // Fabled (Extras)
  | 'angel'
  | 'bootlegger'
  | 'buddhist'
  | 'djinn'
  | 'doomsayer'
  | 'duchess'
  | 'ferryman'
  | 'fibbin'
  | 'fiddler'
  | 'gardener'
  | 'hellslibrarian'
  | 'revolutionary'
  | 'sentinel'
  | 'spiritofivory'
  | 'stormcatcher'
  | 'toymaker'

type HomebrewCharacterId = string

type ReleasedEdition =  'Trouble Brewing'
  | 'Bad Moon Rising'
  | 'Sects and Violets'
  | 'Kickstarter Experimental'
    | 'Fabled'


type UnreleasedEdition = 'Unreleased Experimental'

type Edition =
ReleasedEdition
  | UnreleasedEdition
  | 'Homebrew / Unknown'

type BoxPick = ReleasedEdition | "Substitute"

type MetaObject = {
    id: "_meta",
    [key: string]: any
}

type HomebrewCharacter = {
    id: HomebrewCharacterId,
    name: string,
    [key: string]: any
}

type BagMap = { [key in Character]: Edition }

export type ParsedScript = { [key in BoxPick]: (Character | HomebrewCharacterId)[] }

// Characters
const characterEditionMap: BagMap = {
  // Trouble Brewing
  chef: 'Trouble Brewing',
  investigator: 'Trouble Brewing',
  washerwoman: 'Trouble Brewing',
  librarian: 'Trouble Brewing',
  empath: 'Trouble Brewing',
  fortuneteller: 'Trouble Brewing',
  undertaker: 'Trouble Brewing',
  monk: 'Trouble Brewing',
  ravenkeeper: 'Trouble Brewing',
  virgin: 'Trouble Brewing',
  slayer: 'Trouble Brewing',
  soldier: 'Trouble Brewing',
  mayor: 'Trouble Brewing',
  butler: 'Trouble Brewing',
  drunk: 'Trouble Brewing',
  recluse: 'Trouble Brewing',
  saint: 'Trouble Brewing',
  poisoner: 'Trouble Brewing',
  spy: 'Trouble Brewing',
  scarletwoman: 'Trouble Brewing',
  baron: 'Trouble Brewing',
  imp: 'Trouble Brewing',
  thief: 'Trouble Brewing',
  bureaucrat: 'Trouble Brewing',
  gunslinger: 'Trouble Brewing',
  beggar: 'Trouble Brewing',
  scapegoat: 'Trouble Brewing',

  // Bad Moon Rising
  grandmother: 'Bad Moon Rising',
  sailor: 'Bad Moon Rising',
  chambermaid: 'Bad Moon Rising',
  exorcist: 'Bad Moon Rising',
  innkeeper: 'Bad Moon Rising',
  gossip: 'Bad Moon Rising',
  gambler: 'Bad Moon Rising',
  courtier: 'Bad Moon Rising',
  professor: 'Bad Moon Rising',
  minstrel: 'Bad Moon Rising',
  sweetheart: 'Bad Moon Rising',
  fool: 'Bad Moon Rising',
  moonchild: 'Bad Moon Rising',
  tinker: 'Bad Moon Rising',
  goon: 'Bad Moon Rising',
  lunatic: 'Bad Moon Rising',
  godfather: 'Bad Moon Rising',
  devilsadvocate: 'Bad Moon Rising',
  assassin: 'Bad Moon Rising',
  pukka: 'Bad Moon Rising',
  shabaloth: 'Bad Moon Rising',
  zombuul: 'Bad Moon Rising',
  po: 'Bad Moon Rising',
  pacifist: 'Bad Moon Rising',
  matron: 'Bad Moon Rising',
  judge: 'Bad Moon Rising',
  apprentice: 'Bad Moon Rising',
  voudon: 'Bad Moon Rising',
  bishop: 'Bad Moon Rising',
  mastermind: 'Bad Moon Rising',

  // Sects and Violets
  artist: 'Sects and Violets',
  clockmaker: 'Sects and Violets',
  dreamer: 'Sects and Violets',
  flowergirl: 'Sects and Violets',
  juggler: 'Sects and Violets',
  mathematician: 'Sects and Violets',
  seamstress: 'Sects and Violets',
  towncrier: 'Sects and Violets',
  savant: 'Sects and Violets',
  philosopher: 'Sects and Violets',
  oracle: 'Sects and Violets',
  sage: 'Sects and Violets',
  mutant: 'Sects and Violets',
  barber: 'Sects and Violets',
  klutz: 'Sects and Violets',
  cerenovus: 'Sects and Violets',
  vigormortis: 'Sects and Violets',
  vortox: 'Sects and Violets',
  fanggu: 'Sects and Violets',
  snakecharmer: 'Sects and Violets',
  pithag: 'Sects and Violets',
  eviltwin: 'Sects and Violets',
  witch: 'Sects and Violets',
  barista: 'Sects and Violets',
  harlot: 'Sects and Violets',
  butcher: 'Sects and Violets',
  bonecollector: 'Sects and Violets',
  deviant: 'Sects and Violets',

  // Kickstarter Experimental
  steward: 'Kickstarter Experimental',
  knight: 'Kickstarter Experimental',
  noble: 'Kickstarter Experimental',
  shugenja: 'Kickstarter Experimental',
  pixie: 'Kickstarter Experimental',
  bountyhunter: 'Kickstarter Experimental',
  general: 'Kickstarter Experimental',
  king: 'Kickstarter Experimental',
  engineer: 'Kickstarter Experimental',
  huntsman: 'Kickstarter Experimental',
  alchemist: 'Kickstarter Experimental',
  cannibal: 'Kickstarter Experimental',
  amnesiac: 'Kickstarter Experimental',
  farmer: 'Kickstarter Experimental',
  acrobat: 'Kickstarter Experimental',
  lycanthrope: 'Kickstarter Experimental',
  choirboy: 'Kickstarter Experimental',
  magician: 'Kickstarter Experimental',
  atheist: 'Kickstarter Experimental',
  golem: 'Kickstarter Experimental',
  damsel: 'Kickstarter Experimental',
  snitch: 'Kickstarter Experimental',
  heretic: 'Kickstarter Experimental',
  puzzlemaster: 'Kickstarter Experimental',
  mezepheles: 'Kickstarter Experimental',
  fearmonger: 'Kickstarter Experimental',
  psychopath: 'Kickstarter Experimental',
  marionette: 'Kickstarter Experimental',
  boomdandy: 'Kickstarter Experimental',
  stormcatcher: 'Kickstarter Experimental',
  legion: 'Kickstarter Experimental',
  lleech: 'Kickstarter Experimental',
  alhadikhia: 'Kickstarter Experimental',
  riot: 'Kickstarter Experimental',
  leviathan: 'Kickstarter Experimental',
  gangster: 'Kickstarter Experimental',

  // Unreleased Experimental
  highpriestess: 'Unreleased Experimental',
  balloonist: 'Unreleased Experimental',
  preacher: 'Unreleased Experimental',
  villageidiot: 'Unreleased Experimental',
  alsaahir: 'Unreleased Experimental',
  nightwatchman: 'Unreleased Experimental',
  fisherman: 'Unreleased Experimental',
  banshee: 'Unreleased Experimental',
  ogre: 'Unreleased Experimental',
  plaguedoctor: 'Unreleased Experimental',
  hatter: 'Unreleased Experimental',
  politician: 'Unreleased Experimental',
  zealot: 'Unreleased Experimental',
  harpy: 'Unreleased Experimental',
  wizard: 'Unreleased Experimental',
  widow: 'Unreleased Experimental',
  xaan: 'Unreleased Experimental',
  summoner: 'Unreleased Experimental',
  goblin: 'Unreleased Experimental',
  vizier: 'Unreleased Experimental',
  organgrinder: 'Unreleased Experimental',
  boffin: 'Unreleased Experimental',
  yaggababble: 'Unreleased Experimental',
  lilmonsta: 'Unreleased Experimental',
  ojo: 'Unreleased Experimental',
  kazali: 'Unreleased Experimental',
  lordoftyphon: 'Unreleased Experimental',
  gnome: 'Unreleased Experimental',
  cultleader: 'Unreleased Experimental',
  poppygrower: 'Unreleased Experimental',
  tealady: 'Unreleased Experimental',

  // Fabled
  angel: 'Fabled',
  bootlegger: 'Fabled',
  buddhist: 'Fabled',
  djinn: 'Fabled',
  doomsayer: 'Fabled',
  duchess: 'Fabled',
  ferryman: 'Fabled',
  fibbin: 'Fabled',
  fiddler: 'Fabled',
  gardener: 'Fabled',
  hellslibrarian: 'Fabled',
  revolutionary: 'Fabled',
  sentinel: 'Fabled',
  spiritofivory: 'Fabled',
  toymaker: 'Fabled',
}

export type Script = (Character | HomebrewCharacter | MetaObject)[]

/**
 * Groups an array of character names or homebrew character objects by their Edition.
 * @param characters Array of Character, HomebrewCharacter, or MetaObject
 * @returns Object: { [Edition]: (Character | HomebrewCharacter)[] }
 */
export function groupCharactersByEdition(
  characters: Script
) {
  const editionMap: { [key in Edition]?: (Character | HomebrewCharacterId)[] } = {}

  for (const char of characters) {
    // Ignore meta objects
    if (typeof char === 'object' && char.id === '_meta') continue

    // Homebrew character object
    if (typeof char === 'object') {
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
    const boxPicks: { [key in BoxPick]: (Character | HomebrewCharacterId)[] } = {}

    for (const edition in editions) {
        const boxPick = editionMap[edition as Edition]
        if (!boxPicks[boxPick]) boxPicks[boxPick] = []
        boxPicks[boxPick].push(...editions[edition as Edition]!)
    }

    return boxPicks
}
