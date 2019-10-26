import typescript from 'rollup-plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'src/index.tsx',
  output: {
    file: './lib/react-storer.js',
    format: 'cjs',
  },
  plugins: [
    typescript({ 
      lib: ['es6'], 
      target: 'es5',
      jsx: 'react',
    }),
    uglify()
  ]
}