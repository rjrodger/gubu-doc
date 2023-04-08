/* Copyright (c) 2023 Richard Rodger, MIT License */

import type { GubuShape, State } from 'gubu'

import { Carn } from '@rjrodger/carn'


function gen_GubuShape(gs: GubuShape, carn: Carn) {
  carn.start()
  gs(undefined, {
    err: false,
    log: (point: string, state: State) => {
      if ('kv' === point) {
        let path = state.path.slice(1, state.dI + 1).join('.')
        let node = state.node
        // console.log(state)

        let type = node.t
        let required = node.r
        let dflt = node.v

        let short = node.m?.short || state.key
        carn.add(
          `* ${path}: ${type} ` +
          `${required ? '(required)' : '(default: ' + dflt + ')'} - ${short}`
        )
      }
    }
  })
}


export {
  gen_GubuShape
}
