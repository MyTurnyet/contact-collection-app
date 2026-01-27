import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.windsurf']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: [
                'jest',
                '@jest/*',
                'sinon',
                'msw',
                'nock',
                'proxyquire',
                'rewire',
                'mockery',
              ],
              message:
                'Mocking frameworks are discouraged in this repo. Prefer real implementations or simple test doubles. Override with eslint-disable only when necessary.',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'src/{domain,application,infrastructure,di}/**/*.{ts,tsx}',
    ],
    rules: {
      complexity: ['warn', 4],
      'max-lines-per-function': [
        'warn',
        {
          max: 8,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: [
                'jest',
                '@jest/*',
                'sinon',
                'msw',
                'nock',
                'proxyquire',
                'rewire',
                'mockery',
              ],
              message:
                'Mocking frameworks are discouraged in this repo. Prefer real implementations or simple test doubles. Override with eslint-disable only when necessary.',
            },
            {
              group: [
                '../application/**',
                '../../application/**',
                '../infrastructure/**',
                '../../infrastructure/**',
                '../ui/**',
                '../../ui/**',
                '../di/**',
                '../../di/**',
              ],
              message:
                'Domain layer must not depend on application, infrastructure, UI, or DI. Depend only on domain/shared abstractions.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: [
                'jest',
                '@jest/*',
                'sinon',
                'msw',
                'nock',
                'proxyquire',
                'rewire',
                'mockery',
              ],
              message:
                'Mocking frameworks are discouraged in this repo. Prefer real implementations or simple test doubles. Override with eslint-disable only when necessary.',
            },
            {
              group: [
                '../ui/**',
                '../../ui/**',
                '../infrastructure/**',
                '../../infrastructure/**',
                '../di/**',
                '../../di/**',
              ],
              message:
                'Application layer must not depend on UI, infrastructure, or DI. Use domain types + ports; DI wires infra implementations.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/infrastructure/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: [
                'jest',
                '@jest/*',
                'sinon',
                'msw',
                'nock',
                'proxyquire',
                'rewire',
                'mockery',
              ],
              message:
                'Mocking frameworks are discouraged in this repo. Prefer real implementations or simple test doubles. Override with eslint-disable only when necessary.',
            },
            {
              group: [
                '../ui/**',
                '../../ui/**',
                '../di/**',
                '../../di/**',
              ],
              message:
                'Infrastructure layer must not depend on UI or DI.',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'src/**/__tests__/**/*.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
    ],
    rules: {
      complexity: 'off',
      'max-lines-per-function': 'off',
    },
  },
])
