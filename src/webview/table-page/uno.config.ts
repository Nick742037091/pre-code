import {
  defineConfig,
  presetIcons,
  presetMini,
  presetAttributify
} from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import transformerDirectives from '@unocss/transformer-directives'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'

export default defineConfig({
  presets: [
    presetMini(),
    // 内置样式
    // 支持iconify
    presetIcons({
      collections: {
        local: FileSystemIconLoader('./src/assets/icons', (svg) =>
          svg.replace(/fill="[^"]+"/g, 'fill="currentColor"')
        )
      }
    }),
    // 支持属性化
    presetAttributify()
  ],
  transformers: [
    // 支持css @apply @screen theme() 指令
    transformerDirectives(),
    transformerAttributifyJsx()
  ]
})
