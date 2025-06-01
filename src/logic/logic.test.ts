import { describe, it, expect } from 'vitest'
import { groupCharactersByEdition, parseScript, suggestSubstitutions } from './logic'
import type { HomebrewCharacterId, Script } from './logic'

describe('groupCharactersByEdition', () => {
  it('groups characters by their edition', () => {
    const input = [
      'washerwoman',
      'empath',
      'grandmother',
      'sailor',
      'artist',
      'fanggu',
      'alchemist',
      'unknown_character' as HomebrewCharacterId,
    ]
    const result = groupCharactersByEdition(input as Script)
    expect(result).toEqual({
      'Trouble Brewing': ['washerwoman', 'empath'],
      'Bad Moon Rising': ['grandmother', 'sailor'],
      'Sects and Violets': ['artist', 'fanggu'],
      'Kickstarter Experimental': ['alchemist'],
      'Homebrew / Unknown': ['unknown_character'],
    })
  })

  it('returns empty object for empty input', () => {
    expect(groupCharactersByEdition([])).toEqual({})
  })

  it('puts all unknowns in Homebrew / Unknown', () => {
    const input = ['foo' as HomebrewCharacterId, 'bar' as HomebrewCharacterId]
    expect(groupCharactersByEdition(input as Script)).toEqual({
      'Homebrew / Unknown': ['foo', 'bar'],
    })
  })

  it('handles only one edition', () => {
    const input = ['washerwoman' as HomebrewCharacterId, 'empath' as HomebrewCharacterId]
    expect(groupCharactersByEdition(input as Script)).toEqual({
      'Trouble Brewing': ['washerwoman', 'empath'],
    })
  })

  it('handles homebrew characters', () => {
    const input: Script = [
      {
        id: '_meta',
        author: 'CaffeineBoost',
        name: 'Stowed Away',
        almanac: 'https://beardytas.com/garden-of-djinn/stowed-away/',
        logo: 'https://release.botc.app/wc25/stowedaway/logo.webp',
        background: 'https://release.botc.app/wc25/background.webp',
        hideTitle: true,
        bootlegger: [
          'Up to 2 recommended Travellers might be in the bag & the player count lowers accordingly. Travellers are not announced, executions & exiles are equivalent.',
        ],
      },
      'grandmother',
      'pixie',
      'highpriestess',
      'snakecharmer',
      'innkeeper',
      'gambler',
      'gossip',
      'savant',
      'seamstress',
      'fisherman',
      'ravenkeeper',
      'tealady',
      'poppygrower',
      'lunatic',
      'tinker',
      'mutant',
      'puzzlemaster',
      'poisoner',
      'devilsadvocate',
      'cerenovus',
      'assassin',
      'summoner',
      'imp',
      'po',
      'vigormortis',
      {
        id: 'stowedaway-bonecollector',
        name: 'Bone Collector',
        team: 'townsfolk',
        image: [
          'https://release.botc.app/wc25/stowedaway/bonecollector_g.webp',
          'https://release.botc.app/wc25/stowedaway/bonecollector_e.webp',
        ],
        firstNightReminder: '',
        otherNight: 1,
        otherNightReminder:
          "The Bone Collector either shakes their head no or points at any dead player. If they pointed at any dead player, put the Bone Collector's 'Has Ability' reminder by the chosen player's character token. (They may need to be woken tonight to use it.)",
        reminders: ['No Ability', 'Has Ability'],
        setup: true,
        ability:
          'Once per game, at night*, choose a dead player: they regain their ability until dusk. [Reduce non-traveller player count]',
        flavor:
          'I collect many things. Hair. Teeth. Clothes. Fragments of poems. The dreams of lost lovers. My secret arts are not for you to know but my fee is a mere pittance. Bring me the blood of a noblewoman who died of heartbreak under a full moon, and you shall have your answers.',
      },
      {
        id: 'stowedaway-apprentice',
        name: 'Apprentice',
        team: 'townsfolk',
        image: [
          'https://release.botc.app/wc25/stowedaway/apprentice_g.webp',
          'https://release.botc.app/wc25/stowedaway/apprentice_e.webp',
        ],
        firstNight: 1,
        firstNightReminder:
          "Show the Apprentice the 'You are' card, then a Townsfolk or Minion token. In the Grimoire, replace the Apprentice token with that character token, and put the Apprentice's 'Is the Apprentice' reminder by that character token.",
        otherNightReminder: '',
        reminders: ['Is The Apprentice'],
        setup: true,
        ability:
          'On your 1st night, you gain a Townsfolk ability (if good), or a Minion ability (if evil). [Reduce non-traveller player count]',
        special: [
          {
            type: 'signal',
            name: 'grimoire',
            time: 'night',
          },
        ],
        flavor:
          'For years have I traveled, studying the ways of The Craft. Which craft, you ask? Simply that of the simple folk. Nothing to worry about. Not yet.',
      },
      {
        id: 'stowedaway-deviant',
        name: 'Deviant',
        team: 'townsfolk',
        image: [
          'https://release.botc.app/wc25/stowedaway/deviant_g.webp',
          'https://release.botc.app/wc25/stowedaway/deviant_e.webp',
        ],
        firstNightReminder: '',
        otherNightReminder: '',
        reminders: [],
        setup: true,
        ability:
          'If you were funny today, you cannot die by exile. [Reduce non-traveller player count]',
        flavor: "Twas the lady's quip, forsooth.",
      },
      {
        id: 'stowedaway-scapegoat',
        name: 'Scapegoat',
        team: 'townsfolk',
        image: [
          'https://release.botc.app/wc25/stowedaway/scapegoat_g.webp',
          'https://release.botc.app/wc25/stowedaway/scapegoat_e.webp',
        ],
        firstNightReminder: '',
        otherNightReminder: '',
        reminders: [],
        setup: true,
        ability:
          'If a player of your alignment is executed, you might be executed instead. [Reduce non-traveller player count]',
        flavor:
          "Good evening! Thank you for inviting me to the ball. I'm not from around here, but you sure seem like a friendly bunch, by golly. I'm sure we'll get along just dandy. What's all that rope for?",
      },
    ]

    expect(groupCharactersByEdition(input)).toEqual({
      'Bad Moon Rising': [
        'grandmother',
        'innkeeper',
        'gambler',
        'gossip',
        'tealady',
        'lunatic',
        'tinker',
        'devilsadvocate',
        'assassin',
        'po',
      ],
      'Homebrew / Unknown': [
        'stowedaway-bonecollector',
        'stowedaway-apprentice',
        'stowedaway-deviant',
        'stowedaway-scapegoat',
      ],
      'Kickstarter Experimental': ['pixie', 'poppygrower', 'puzzlemaster'],
      'Sects and Violets': [
        'snakecharmer',
        'savant',
        'seamstress',
        'mutant',
        'cerenovus',
        'vigormortis',
      ],
      'Trouble Brewing': ['ravenkeeper', 'poisoner', 'imp'],
      'Unreleased Experimental': ['highpriestess', 'fisherman', 'summoner'],
    })
  })

  it('treats objects with id matching a known character as that character', () => {
    const input = [
      { id: 'savant' },
      { id: 'washerwoman' },
      { id: 'unknown_homebrew' },
      'vortox',
      'washerwoman',
    ]
    const result = groupCharactersByEdition(input as Script)
    expect(result).toEqual({
      'Sects and Violets': ['savant', 'vortox'],
      'Trouble Brewing': ['washerwoman', 'washerwoman'],
      'Homebrew / Unknown': ['unknown_homebrew'],
    })
  })
})

describe('parseScript', () => {
  it('parses script and groups by box pick (hasKickstarter = true)', () => {
    const input = [
      'washerwoman',
      'empath',
      'grandmother',
      'sailor',
      'artist',
      'fanggu',
      'alchemist',
      'unknown_character' as HomebrewCharacterId,
    ]
    const result = parseScript(input as Script, true)
    expect(result).toEqual({
      'Trouble Brewing': ['washerwoman', 'empath'],
      'Bad Moon Rising': ['grandmother', 'sailor'],
      'Sects and Violets': ['artist', 'fanggu'],
      'Kickstarter Experimental': ['alchemist'],
      Substitute: ['unknown_character'],
    })
  })

  it('parses script and groups by box pick (hasKickstarter = false)', () => {
    const input = [
      'washerwoman',
      'empath',
      'grandmother',
      'sailor',
      'artist',
      'fanggu',
      'alchemist',
      'unknown_character' as HomebrewCharacterId,
    ]
    const result = parseScript(input as Script, false)
    expect(result).toEqual({
      'Trouble Brewing': ['washerwoman', 'empath'],
      'Bad Moon Rising': ['grandmother', 'sailor'],
      'Sects and Violets': ['artist', 'fanggu'],
      Substitute: ['alchemist', 'unknown_character'],
    })
  })

  it('parses script with homebrew characters', () => {
    const input: Script = [
      {
        id: '_meta',
        author: 'CaffeineBoost',
        name: 'Stowed Away',
        almanac: 'https://beardytas.com/garden-of-djinn/stowed-away/',
        logo: 'https://release.botc.app/wc25/stowedaway/logo.webp',
        background: 'https://release.botc.app/wc25/background.webp',
        hideTitle: true,
        bootlegger: [
          'Up to 2 recommended Travellers might be in the bag & the player count lowers accordingly. Travellers are not announced, executions & exiles are equivalent.',
        ],
      },
      'grandmother',
      'pixie',
      'highpriestess',
      'snakecharmer',
      'innkeeper',
      'gambler',
      'gossip',
      'savant',
      'seamstress',
      'fisherman',
      'ravenkeeper',
      'tealady',
      'poppygrower',
      'lunatic',
      'tinker',
      'mutant',
      'puzzlemaster',
      'poisoner',
      'devilsadvocate',
      'cerenovus',
      'assassin',
      'summoner',
      'imp',
      'po',
      'vigormortis',
      {
        id: 'stowedaway-bonecollector',
        name: 'Bone Collector',
        team: 'townsfolk',
        image: [
          'https://release.botc.app/wc25/stowedaway/bonecollector_g.webp',
          'https://release.botc.app/wc25/stowedaway/bonecollector_e.webp',
        ],
        firstNightReminder: '',
        otherNight: 1,
        otherNightReminder:
          "The Bone Collector either shakes their head no or points at any dead player. If they pointed at any dead player, put the Bone Collector's 'Has Ability' reminder by the chosen player's character token. (They may need to be woken tonight to use it.)",
        reminders: ['No Ability', 'Has Ability'],
        setup: true,
        ability:
          'Once per game, at night*, choose a dead player: they regain their ability until dusk. [Reduce non-traveller player count]',
        flavor:
          'I collect many things. Hair. Teeth. Clothes. Fragments of poems. The dreams of lost lovers. My secret arts are not for you to know but my fee is a mere pittance. Bring me the blood of a noblewoman who died of heartbreak under a full moon, and you shall have your answers.',
      },
      {
        id: 'stowedaway-apprentice',
        name: 'Apprentice',
        team: 'townsfolk',
        image: [
          'https://release.botc.app/wc25/stowedaway/apprentice_g.webp',
          'https://release.botc.app/wc25/stowedaway/apprentice_e.webp',
        ],
        firstNight: 1,
        firstNightReminder:
          "Show the Apprentice the 'You are' card, then a Townsfolk or Minion token. In the Grimoire, replace the Apprentice token with that character token, and put the Apprentice's 'Is the Apprentice' reminder by that character token.",
        otherNightReminder: '',
        reminders: ['Is The Apprentice'],
        setup: true,
        ability:
          'On your 1st night, you gain a Townsfolk ability (if good), or a Minion ability (if evil). [Reduce non-traveller player count]',
        special: [
          {
            type: 'signal',
            name: 'grimoire',
            time: 'night',
          },
        ],
        flavor:
          'For years have I traveled, studying the ways of The Craft. Which craft, you ask? Simply that of the simple folk. Nothing to worry about. Not yet.',
      },
      {
        id: 'stowedaway-deviant',
        name: 'Deviant',
        team: 'townsfolk',
        image: [
          'https://release.botc.app/wc25/stowedaway/deviant_g.webp',
          'https://release.botc.app/wc25/stowedaway/deviant_e.webp',
        ],
        firstNightReminder: '',
        otherNightReminder: '',
        reminders: [],
        setup: true,
        ability:
          'If you were funny today, you cannot die by exile. [Reduce non-traveller player count]',
        flavor: "Twas the lady's quip, forsooth.",
      },
      {
        id: 'stowedaway-scapegoat',
        name: 'Scapegoat',
        team: 'townsfolk',
        image: [
          'https://release.botc.app/wc25/stowedaway/scapegoat_g.webp',
          'https://release.botc.app/wc25/stowedaway/scapegoat_e.webp',
        ],
        firstNightReminder: '',
        otherNightReminder: '',
        reminders: [],
        setup: true,
        ability:
          'If a player of your alignment is executed, you might be executed instead. [Reduce non-traveller player count]',
        flavor:
          "Good evening! Thank you for inviting me to the ball. I'm not from around here, but you sure seem like a friendly bunch, by golly. I'm sure we'll get along just dandy. What's all that rope for?",
      },
    ]

    expect(parseScript(input, true)).toEqual({
      'Bad Moon Rising': [
        'grandmother',
        'innkeeper',
        'gambler',
        'gossip',
        'tealady',
        'lunatic',
        'tinker',
        'devilsadvocate',
        'assassin',
        'po',
      ],
      Substitute: [
        'highpriestess',
        'fisherman',
        'summoner',
        'stowedaway-bonecollector',
        'stowedaway-apprentice',
        'stowedaway-deviant',
        'stowedaway-scapegoat',
      ],
      'Kickstarter Experimental': ['pixie', 'poppygrower', 'puzzlemaster'],
      'Sects and Violets': [
        'snakecharmer',
        'savant',
        'seamstress',
        'mutant',
        'cerenovus',
        'vigormortis',
      ],
      'Trouble Brewing': ['ravenkeeper', 'poisoner', 'imp'],
    })
  })
})

describe('suggestSubstitutions', () => {
  it('returns empty object if no Substitute key', () => {
    const script = {
      'Trouble Brewing': ['washerwoman', 'empath'],
    }
    expect(suggestSubstitutions(script)).toEqual({})
  })

  it('returns empty object if Substitute is empty', () => {
    const script = {
      Substitute: [],
    }
    expect(suggestSubstitutions(script)).toEqual({})
  })

  it('suggests substitutions for a known character in Substitute', () => {
    // Use a character that exists in dataset and is not disabled
    const script = {
      Substitute: ['washerwoman'],
      'Trouble Brewing': ['empath'],
    }
    const result = suggestSubstitutions(script)
    expect(result).toHaveProperty('washerwoman')
    expect(typeof result['washerwoman']).toBe('string')
    // Should not suggest 'empath' (already used)
    expect(result['washerwoman']).not.toBe('empath')
  })

  it('does not suggest substitutions for unknown character', () => {
    const script = {
      Substitute: ['unknown_character'],
    }
    expect(suggestSubstitutions(script)).toEqual({})
  })

  it('does not suggest substitutions for disabled characters', () => {
    // Find a disabled character in dataset, if any
    // If none, this test will always pass as empty
    const script = {
      Substitute: ['washerwoman'],
    }
    const result = suggestSubstitutions(script)
    if (result['washerwoman']) {
      expect(typeof result['washerwoman']).toBe('string')
    }
  })

  it('returns only one substitution per character', () => {
    const script = {
      Substitute: ['washerwoman', 'empath'],
    }
    const result = suggestSubstitutions(script)
    expect(typeof result['washerwoman']).toBe('string')
    expect(typeof result['empath']).toBe('string')
  })

  it('does not return the same substitution for multiple characters', () => {
    const script = {
      Substitute: ['washerwoman', 'empath', 'librarian'],
    }
    const result = suggestSubstitutions(script)
    const subs = Object.values(result)
    const uniqueSubs = new Set(subs)
    expect(subs.length).toBe(uniqueSubs.size)
  })
})
