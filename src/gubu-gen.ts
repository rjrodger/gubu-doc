/* Copyright (c) 2023 Richard Rodger, MIT License */

import Fs from 'fs'

import type { GubuShape, State } from 'gubu'

import { Carn } from '@rjrodger/carn'

type Generator = (gs: GubuShape, carn: Carn) => void

const MarkerMap: Record<string, string[]> = {
  md: ['<!--', '-->'],
}

const GeneratorMap: Record<string, Generator> = {
  'options~md': function (gs: GubuShape, carn: Carn) {
    carn.start()
    carn.add('## Options')

    // console.log('GS', gs)

    let opts: any = []
    gs(undefined, {
      err: false,
      log: (point: string, state: State) => {
        // console.log('POINT', point)
        if ('kv' === point) {
          let parts = state.path.slice(1, state.dI + 1)
          let path = parts.join('.')
          let node = state.node
          let key = state.key
          opts.push({ path, parts, node, key })
        }
      },
    })

    opts = opts.sort((a: any, b: any) => {
      return a.path < b.path ? -1 : a.path > b.path ? 1 : 0
    })

    // console.log('OPTS', opts)

    let depth = 1
    for (let opt of opts) {
      let { path, parts, node, key } = opt

      let type = node.t
      let required = node.r
      let dflt = node.v

      let short = node.m?.short || key

      let lastpart = parts[parts.length - 1]

      while (depth < parts.length) {
        carn.add(`* _${parts[depth - 1]}_`)
        carn.depth(1)
        depth++
      }

      while (parts.length < depth) {
        carn.depth(-1)
        depth--
      }

      carn.add(
        `* _${lastpart}_: \`${type}\` ` +
          `${required ? '(required)' : '(default: ' + dflt + ')'} - ${short}`,
      )
    }
  },
}

function resolve_generate(spec: GenerateSpec, ctx?: any): Generator {
  let generator = spec.generator
  let format = spec.format

  let gen_name = generator + '~' + format
  let gen_func = GeneratorMap[gen_name]

  if (null === gen_func) {
    let errmsg =
      `Cannot find generator ${spec.generator} for ` + `format ${spec.format}`
    if (ctx?.errs) {
      ctx?.errs.push(errmsg)
    } else {
      throw new Error(errmsg)
    }
  }

  return gen_func
}

type GenerateSpec = {
  shape: GubuShape
  generator: string
  format: string
  target: string
}

class GubuGen {
  constructor() {}

  generate(spec: GenerateSpec) {
    // console.log('GUBUGEN:', spec)

    let genfunc = resolve_generate(spec)
    const carn = new Carn()
    genfunc(spec.shape, carn)

    let text = load_file(spec.target)
    let out = carn.inject(text, spec.generator, MarkerMap[spec.format])
    save_file(spec.target, out)

    return carn
  }
}

function load_file(path: string) {
  return Fs.readFileSync(path).toString()
}

function save_file(path: string, text: string) {
  return Fs.writeFileSync(path, text)
}

export type { Generator, GenerateSpec }

export { GubuGen, GeneratorMap, MarkerMap }
