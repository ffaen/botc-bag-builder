<script setup lang="ts">
import { ref, watch } from 'vue'
import { parseScript, type ParsedScript, isTraveller } from './logic/logic'
import type { Character } from './logic/dataset-types'

const scriptInput = ref<string>('')
const parseResult = ref<ParsedScript | null>(null)
const error = ref<string | null>(null)
const hasKickstarter = ref<boolean>(false)

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
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <header class="mb-8 flex flex-col items-center">
      <img src="@/assets/logo.png" alt="BOTC Logo" class="w-24 h-24 mb-4 rounded-lg" />
      <h1 class="text-3xl font-bold text-blue-700 drop-shadow">BOTC Bag Builder</h1>
    </header>

    <main class="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
      <div class="w-full space-y-4">
        <label class="block font-semibold text-gray-700 w-full">
          <span class="block mb-2">Paste Script JSON or URL</span>
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
          <div v-for="(chars, boxPick) in parseResult" :key="boxPick">
            <h3 class="text-blue-700 font-semibold text-base mb-2">{{ boxPick }}</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="char in chars"
                :key="char"
                :class="[
                  'inline-flex items-center px-2 py-1 rounded text-xs font-medium border',
                  isTraveller(char as Character)
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : 'bg-blue-100 text-blue-800 border-blue-200',
                ]"
              >
                {{ char }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
