import { defineConfig } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier/flat'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([...nextVitals, ...nextTs, prettierConfig])

export default eslintConfig
