/* Copyright (c) 2023 Richard Rodger, MIT License */

import { Gubu } from 'gubu'
import { Carn } from '@rjrodger/carn'

import { GeneratorMap } from '..'

describe('gen', () => {
  test('GubuShape-happy', () => {
    let gs0 = Gubu({ a: 1 })
    let c0 = new Carn()
    GeneratorMap['options~md'](gs0, c0)
    expect(c0.src()).toContain('Options')
  })
})
