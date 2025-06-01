<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { parseScript, type ParsedScript, isTraveller, suggestSubstitutions } from './logic/logic'
import type { Character } from './logic/dataset-types'
import { idNameMap } from './logic/dataset-types'

const scriptInput = ref<string>('')
const parseResult = ref<ParsedScript | null>(null)
const error = ref<string | null>(null)
const hasKickstarter = ref<boolean>(false)
const dragActive = ref(false)

function isProbablyUrl(text: string): boolean {
  try {
    const url = new URL(text.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

async function handlePaste(event: ClipboardEvent) {
  error.value = null
  parseResult.value = null
  const text = event.clipboardData?.getData('text')
  if (!text) return

  // If it's a URL, fetch and parse
  if (isProbablyUrl(text)) {
    scriptInput.value = text.trim()
    try {
      const response = await fetch(scriptInput.value)
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const json = await response.json()
      scriptInput.value = JSON.stringify(json, null, 2)
      parseResult.value = parseScript(json, hasKickstarter.value)
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = 'Failed to fetch or parse JSON: ' + e.message
        return
      }
      error.value = 'Unknown error.'
    }
    return
  }

  // Otherwise, treat as JSON
  scriptInput.value = text
  try {
    const json = JSON.parse(scriptInput.value)
    parseResult.value = parseScript(json, hasKickstarter.value)
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = 'Failed to parse JSON: ' + e.message
      return
    }
    error.value = 'Unknown error.'
  }
}

function tryParse() {
  error.value = null
  parseResult.value = null
  try {
    const json = JSON.parse(scriptInput.value)
    parseResult.value = parseScript(json, hasKickstarter.value)
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = 'Failed to parse JSON: ' + e.message
      return
    }
    error.value = 'Unknown error.'
  }
}

watch(hasKickstarter, () => {
  if (!scriptInput.value) return
  try {
    const json = JSON.parse(scriptInput.value)
    parseResult.value = parseScript(json, hasKickstarter.value)
    error.value = null
  } catch {
    // Do not update parseResult, keep error as is or set to null
  }
})

const boxOrder = [
  'Trouble Brewing',
  'Bad Moon Rising',
  'Sects and Violets',
  'Kickstarter Experimental',
  'Substitute',
] as const

type BoxName = (typeof boxOrder)[number]

function handleDrop(event: DragEvent) {
  event.preventDefault()
  dragActive.value = false
  error.value = null
  parseResult.value = null
  if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) return
  const file = event.dataTransfer.files[0]
  if (!file.name.endsWith('.json')) {
    error.value = 'Please drop a JSON file.'
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    const text = reader.result as string
    scriptInput.value = text
    try {
      const json = JSON.parse(text)
      parseResult.value = parseScript(json, hasKickstarter.value)
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = 'Failed to parse JSON: ' + e.message
        return
      }
      error.value = 'Unknown error.'
    }
  }
  reader.onerror = () => {
    error.value = 'Failed to read file.'
  }
  reader.readAsText(file)
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  dragActive.value = true
}

function handleDragLeave(event: DragEvent) {
  // Only hide overlay if leaving the main container
  if (event.target === event.currentTarget) {
    dragActive.value = false
  }
}

const substitutions = computed(() =>
  parseResult.value ? suggestSubstitutions(parseResult.value) : {},
)
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <transition name="fade">
      <div
        v-if="dragActive"
        class="absolute inset-0 z-50 flex items-center justify-center bg-blue-900 bg-opacity-70 pointer-events-none"
        style="backdrop-filter: blur(2px)"
      >
        <div
          class="text-white text-2xl font-bold px-8 py-6 rounded-lg bg-blue-800 bg-opacity-80 border-4 border-dashed border-white shadow-xl"
        >
          Drop to upload your script.json
        </div>
      </div>
    </transition>
    <header class="mb-8 flex flex-col items-center">
      <img src="@/assets/logo.png" alt="BOTC Logo" class="w-24 h-24 mb-4 rounded-lg" />
      <h1 class="text-3xl font-bold text-blue-700 drop-shadow">BOTC Bag Builder</h1>
    </header>

    <main class="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
      <div class="w-full space-y-4">
        <label class="block font-semibold text-gray-700 w-full">
          <span class="block mb-2">Paste Script JSON or URL, or drop a script.json file here.</span>
          <textarea
            v-model="scriptInput"
            placeholder="Paste Script JSON or a URL to JSON here (Ctrl+V)"
            rows="8"
            cols="60"
            @paste="handlePaste"
            class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm bg-gray-50"
          ></textarea>
        </label>
        <div class="flex items-center space-x-2">
          <input
            id="kickstarter-checkbox"
            type="checkbox"
            v-model="hasKickstarter"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            for="kickstarter-checkbox"
            class="text-gray-700 font-medium select-none cursor-pointer"
          >
            I have the Kickstarter set
          </label>
        </div>
        <button
          @click="tryParse"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Parse Script
        </button>
      </div>
      <div v-if="error" class="text-red-600 mt-4 w-full text-center font-semibold">{{ error }}</div>
      <div v-if="parseResult" class="mt-6 w-full">
        <h2 class="text-lg font-bold text-gray-800 mb-2">Character Collections:</h2>
        <div class="space-y-6">
          <template v-for="boxPick in boxOrder" :key="boxPick">
            <div
              v-if="
                parseResult &&
                (parseResult as Record<BoxName, string[]>)[boxPick] &&
                (parseResult as Record<BoxName, string[]>)[boxPick].length > 0
              "
            >
              <h3 class="text-blue-700 font-semibold text-base mb-2">{{ boxPick }}</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="char in (parseResult as Record<BoxName, string[]>)[boxPick]"
                  :key="char"
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded text-xs font-medium border',
                    isTraveller(char as Character)
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : 'bg-blue-100 text-blue-800 border-blue-200',
                  ]"
                >
                  {{ idNameMap[char as Character] || char }}
                  <span class="ml-1" v-if="Object.keys(substitutions).includes(char)">
                    (Substitute with {{ idNameMap[substitutions[char as Character] as Character] }})
                  </span>
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
