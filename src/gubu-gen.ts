/* Copyright (c) 2023 Richard Rodger, MIT License */

import type { GubuShape, State } from 'gubu'

import { Carn } from '@rjrodger/carn'


type Generator = (gs: GubuShape, carn: Carn) => void


const MarkerMap: Record<string, string[]> = {
  md: ['<!--', '-->']
}

const GeneratorMap: Record<string, Generator> = {
  'options~md': function(gs: GubuShape, carn: Carn) {
    carn.start()
    carn.add('## Options')

    let opts: any = []
    gs(undefined, {
      err: false,
      log: (point: string, state: State) => {
        if ('kv' === point) {
          let parts = state.path.slice(1, state.dI + 1)
          let path = parts.join('.')
          let node = state.node
          let key = state.key
          opts.push({ path, parts, node, key })
        }
      }
    })

    opts = opts.sort((a: any, b: any) => {
      return a.path < b.path ? -1 : a.path > b.path ? 1 : 0
    })


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
        `${required ? '(required)' : '(default: ' + dflt + ')'} - ${short}`
      )
    }
  }
}


export type {
  Generator
}

export {
  GeneratorMap,
  MarkerMap,
}
