# BOTC Bag Builder

BOTC Bag Builder is a web tool for parsing and organizing Blood on the Clocktower (BOTC) script JSON files. It helps storytellers and players quickly determine which character tokens are needed for a given script, grouped by edition and box.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Setup

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Start the development server:**

   ```sh
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) (or as indicated in your terminal).

3. **Build for production:**

   ```sh
   npm run build
   ```

4. **Preview the production build:**
   ```sh
   npm run preview
   ```

### Linting and Formatting

- **Lint with ESLint and Oxlint:**
  ```sh
  npm run lint
  ```
- **Format code with Prettier:**
  ```sh
  npm run format
  ```

### Type Checking

- **Type-check the project:**
  ```sh
  npm run type-check
  ```

### Testing

- **Test the project with Vitest:**
  ```sh
  npm run test
  ```

## Usage

1. Open the app in your browser.
2. Upload a script JSON file, paste a script, or provide a URL to a script JSON.
3. Optionally, check the "I have the Kickstarter set" box if you own the Kickstarter edition.
4. Click "Parse Script" to see the required tokens grouped by box.

## Technologies Used

- [Vue 3](https://vuejs.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript

---

_Blood on the Clocktower is a trademark of The Pandemonium Institute. This project is not affiliated with or endorsed by The Pandemonium Institute._
