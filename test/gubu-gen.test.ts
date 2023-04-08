/* Copyright (c) 2023 Richard Rodger, MIT License */

import { Gubu } from 'gubu'
import { Carn } from '@rjrodger/carn'

import { gen_GubuShape } from '..'

describe('gen', () => {
  test('GubuShape-happy', () => {
    let gs0 = Gubu({ a: 1 })
    let c0 = new Carn()
    gen_GubuShape(gs0, c0)
    console.log(c0.src())
  })
})
