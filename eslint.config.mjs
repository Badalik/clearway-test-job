// @ts-check
import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import importPlugin from 'eslint-plugin-import';
import rxjs from 'eslint-plugin-rxjs';

export default tseslint.config(
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      '@stylistic/ts': stylisticTs,
      rxjs: fixupPluginRules(rxjs),
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      importPlugin.flatConfigs.recommended,
      // rxjs.configs.recommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'max-len': ['error', { code: 120 }],
      curly: 'error',
      'no-useless-escape': 'off',
      'no-var': 'error',
      'quote-props': ['error', 'as-needed'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-restricted-imports': ['error', 'rxjs/Rx', 'lodash'],
      'object-curly-spacing': ['error', 'always'],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/contextual-decorator': ['error'],
      '@angular-eslint/contextual-lifecycle': ['error'],
      '@angular-eslint/no-attribute-decorator': ['error'],
      '@angular-eslint/no-conflicting-lifecycle': ['error'],
      '@angular-eslint/no-empty-lifecycle-method': ['error'],
      '@angular-eslint/no-forward-ref': ['error'],
      // '@angular-eslint/no-host-metadata-property': ['error'],
      '@angular-eslint/no-lifecycle-call': ['error'],
      '@angular-eslint/no-queries-metadata-property': ['error'],
      '@angular-eslint/use-lifecycle-interface': ['error'],
      '@angular-eslint/use-pipe-transform-interface': ['error'],
      'import/first': 'error',
      'import/named': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/no-self-import': ['error'],
      'import/no-mutable-exports': ['error'],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object', 'type'],
          pathGroups: [
            { pattern: '@angular/**', group: 'builtin' },
            { pattern: 'rxjs/**', group: 'builtin' },
            { pattern: 'rxjs', group: 'builtin' },
            { pattern: '@core/**', group: 'internal', position: 'before' },
            { pattern: '@shared/**', group: 'internal', position: 'after' },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroupsExcludedImportTypes: [],
        },
      ],
      '@typescript-eslint/ban-tslint-comment': 'error',
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-decorated-field',
            'protected-decorated-field',
            'private-decorated-field',
            'public-field',
            'protected-field',
            'private-field',
            'constructor',
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            'public-method',
            'protected-method',
            'private-method',
          ],
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'enumMember',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'classProperty',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'classMethod',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'parameterProperty',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'objectLiteralProperty',
          format: ['camelCase', 'snake_case'],
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
          modifiers: ['requiresQuotes'],
        },
      ],
      '@typescript-eslint/no-confusing-non-null-assertion': ['error'],
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: false,
        },
      ],
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
        'error',
        {
          allowComparingNullableBooleansToTrue: true,
          allowComparingNullableBooleansToFalse: true,
        },
      ],
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          ignoreRestArgs: true,
        },
      ],
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': ['error'],
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: ['decoratedFunctions', 'protected-constructors', 'private-constructors'],
        },
      ],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': ['error'],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-useless-constructor': 'off',
      'class-methods-use-this': 'off',
      '@typescript-eslint/class-methods-use-this': [
        'error',
        {
          ignoreClassesThatImplementAnInterface: true,
        },
      ],
      '@typescript-eslint/no-useless-constructor': ['error'],
      '@stylistic/ts/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        },
      ],
      'brace-style': 'off',
      '@stylistic/ts/brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: false,
        },
      ],
      'func-call-spacing': 'off',
      '@stylistic/ts/func-call-spacing': ['error', 'never'],
      'no-extra-parens': 'off',
      '@stylistic/ts/no-extra-parens': ['warn'],
      'no-extra-semi': 'off',
      '@stylistic/ts/no-extra-semi': ['error'],
      quotes: 'off',
      '@stylistic/ts/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],
      '@stylistic/ts/comma-dangle': ['error', {
        objects: 'always-multiline',
        arrays: 'always-multiline',
        functions: 'always-multiline',
      }],
      '@stylistic/ts/semi': ['error', 'always'],
      'rxjs/no-async-subscribe': 'error',
      'rxjs/no-ignored-observable': 'warn',
      'rxjs/no-compat': 'error',
      'rxjs/no-connectable': 'error',
      'rxjs/no-create': 'error',
      'rxjs/no-ignored-notifier': 'error',
      'rxjs/no-ignored-replay-buffer': 'error',
      'rxjs/no-internal': 'error',
      'rxjs/no-nested-subscribe': 'warn',
      'rxjs/no-subject-unsubscribe': 'error',
      'rxjs/no-unbound-methods': 'error',
      'rxjs/no-unsafe-catch': 'error',
      'rxjs/no-unsafe-first': 'error',
      'rxjs/no-unsafe-switchmap': 'error',
      'rxjs/no-unsafe-takeuntil': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      '@angular-eslint/template/elements-content': ['error'],
      '@angular-eslint/template/banana-in-box': ['error'],
      '@angular-eslint/template/eqeqeq': ['error'],
      '@angular-eslint/template/no-any': ['error'],
      '@angular-eslint/template/no-call-expression': ['warn'],
      '@angular-eslint/template/no-negated-async': ['error'],
    },
  },
);
