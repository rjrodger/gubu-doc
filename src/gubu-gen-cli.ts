/* Copyright (c) 2023 Richard Rodger, MIT License */

import Path from 'path'

import { Gubu } from 'gubu'
import { Carn } from '@rjrodger/carn'
import { util } from '@jsonic/jsonic-next'

import { gen_GubuShape } from './gubu-gen'


import type { GubuShape } from 'gubu'

type Args = {
  errs: string[]
  help: boolean
  source: string
  property: string
  target: string
  format: string
  generator: string
}


type Exit = (exit_code: number) => void

type Context = {
  console: Console,
  exit: Exit,
}

run(
  process.argv,
  {
    console,
    exit: (code: number) => process.exit(code)
  }
).catch((e) => console.error(e))


export async function run(argv: string[], ctx: Context) {
  let args = handle_args(parse_args(argv), ctx)

  const mod = resolve_source(args, ctx)
  const shape = resolve_shape(args, mod, ctx)

  const carn = new Carn()

  // NEXT: Gubu doc full feature
  // NEXT: select generator function
  // NEXT: inject into target

  gen_GubuShape(shape, carn)
  console.log(carn.src())
}


function resolve_source(args: Args, ctx: Context): string {

  try {
    let fullsource = args.source
    if (!Path.isAbsolute(fullsource)) {
      fullsource = Path.join(process.cwd(), fullsource)
    }
    return require(fullsource)
  }
  catch (e: any) {
    args.errs.push(`Cannot load module (${args.source}): ` + e.message)
    handle_errs(args, ctx)
    return ''
  }
}


function resolve_shape(args: Args, mod: any, ctx: Context): GubuShape {
  let origprop = args.property

  // Supports . paths
  let ref = util.prop(mod, origprop, undefined)

  if (null == ref) {
    args.errs.push('Cannot find shape at: ' + origprop + ' in file: ' + args.source)
  }

  // FIX: should infer GubuShape
  const shape = (Gubu(ref) as GubuShape)

  handle_errs(args, ctx)

  return shape
}


function handle_args(args: any, ctx: Context) {
  // resolve file paths etc

  handle_errs(args, ctx)

  if (args.help) {
    help(ctx)
    ctx.exit(0)
  }

  return args
}


function handle_errs(args: any, ctx: Context) {
  if (0 < args.errs.length) {
    args.errs.map((err: string) => {
      console.log('ERROR: ' + err)
    })
    ctx.exit(1)
  }

  return args
}



function parse_args(argv: string[]) {
  const args = {
    // TODO: move to ctx
    errs: ([] as string[]),

    help: false,
    source: '', // Source file containing GubuShape
    property: 'defaults', // Property path to GubuShape in required source file
    target: '', // Target file to update with generated code
    format: 'md', // Target file format
    generator: 'options' // Code generator function
  }

  let accept_args = true
  for (let aI = 2; aI < argv.length; aI++) {
    let arg = argv[aI]

    if (accept_args && arg.startsWith('-')) {
      if ('--' === arg) {
        accept_args = false
      } else if ('--source' === arg || '-s' === arg) {
        args.source = argv[++aI]
      } else if ('--property' === arg || '-p' === arg) {
        args.property = argv[++aI]
      } else if ('--target' === arg || '-t' === arg) {
        args.target = argv[++aI]
      } else if ('--format' === arg || '-f' === arg) {
        args.format = argv[++aI]
      } else if ('--generator' === arg || '-g' === arg) {
        args.generator = argv[++aI]
      } else if ('--help' === arg || '-h' === arg) {
        args.help = true
      } else {
        args.errs.push('Unknown command option: ' + arg)
      }
    } else if ('' === args.source) {
      args.source = arg
    }
    else {
      args.errs.push('Extra source file specified (only one is needed): ' + arg)
    }
  }

  return args
}


function help(ctx: Context) {
  let s = `
Help for gubu-gen.
`

  ctx.console.log(s)
}


