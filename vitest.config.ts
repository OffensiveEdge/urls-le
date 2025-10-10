import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**'],
    coverage: {
      reporter: ['text', 'lcov'],
      include: [
        'src/extension.ts',
        'src/commands/**/*.ts',
        'src/config/**/*.ts',
        'src/extraction/**/*.ts',
        'src/telemetry/**/*.ts',
        'src/ui/**/*.ts',
        'src/utils/**/*.ts',
        'src/providers/**/*.ts',
      ],
      exclude: [
        'src/**/*.test.ts',
        'test/**',
        'dist/**',
        'src/__mocks__/**',
        'src/types.ts',
        'src/interfaces/**',
      ],
    },
  },
  resolve: {
    alias: {
      vscode: path.resolve(__dirname, 'src/__mocks__/vscode.ts'),
    },
  },
})
