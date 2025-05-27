<script setup lang="ts">
import { ref } from 'vue'
import { parseScript, type ParsedScript, isTraveller, type Character } from './logic/logic'

const scriptInput = ref<string>('')
const parseResult = ref<ParsedScript | null>(null)
const error = ref<string | null>(null)
const hasKickstarter = ref<boolean>(false)
const urlInput = ref<string>('') // New: for URL input

function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  const reader = new FileReader()
  reader.onload = () => {
    scriptInput.value = reader.result as string
    tryParse()
  }
  reader.readAsText(files[0])
}

function handlePaste(event: ClipboardEvent) {
  const text = event.clipboardData?.getData('text')
  if (text) {
    scriptInput.value = text
    tryParse()
  }
}

async function handleUrlPaste() {
  error.value = null
  parseResult.value = null
  if (!urlInput.value) {
    error.value = 'Please enter a URL.'
    return
  }
  try {
    const response = await fetch(urlInput.value)
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
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
}

function tryParse() {
  error.value = null
  parseResult.value = null
  try {
    const json = JSON.parse(scriptInput.value)
    parseResult.value = parseScript(json, hasKickstarter.value)
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = 'Failed to fetch or parse JSON: ' + e.message
      return
    }
    error.value = 'Unknown error.'
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-blue-700 drop-shadow">BOTC Bag Builder</h1>
    </header>

    <main class="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
      <div class="w-full space-y-4">
        <label class="block font-semibold text-gray-700">
          <span class="block mb-2">Upload Script JSON</span>
          <input
            type="file"
            accept="application/json"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
        <label class="block font-semibold text-gray-700">
          <span class="block mb-2">Paste Script JSON URL</span>
          <div class="flex gap-2">
            <input
              v-model="urlInput"
              type="url"
              placeholder="Paste JSON URL here"
              class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm bg-gray-50"
            />
            <button
              @click="handleUrlPaste"
              class="py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
            >
              Fetch
            </button>
          </div>
        </label>
        <div class="flex items-center justify-between">
          <label class="block font-semibold text-gray-700 w-full">
            <span class="block mb-2">Paste Script JSON</span>
            <textarea
              v-model="scriptInput"
              placeholder="Paste Script JSON here"
              rows="8"
              cols="60"
              @paste="handlePaste"
              class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm bg-gray-50"
            ></textarea>
          </label>
        </div>
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

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
