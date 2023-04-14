"use strict";
/* Copyright (c) 2023 Richard Rodger, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkerMap = exports.GeneratorMap = exports.GubuGen = void 0;
const fs_1 = __importDefault(require("fs"));
const carn_1 = require("@rjrodger/carn");
const MarkerMap = {
    md: ['<!--', '-->'],
};
exports.MarkerMap = MarkerMap;
const GeneratorMap = {
    'options~md': function (gs, carn) {
        var _a;
        carn.start();
        carn.add('## Options');
        console.log('GS', gs);
        let opts = [];
        gs(undefined, {
            err: false,
            log: (point, state) => {
                console.log('POINT', point);
                if ('kv' === point) {
                    let parts = state.path.slice(1, state.dI + 1);
                    let path = parts.join('.');
                    let node = state.node;
                    let key = state.key;
                    opts.push({ path, parts, node, key });
                }
            },
        });
        opts = opts.sort((a, b) => {
            return a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
        });
        console.log('OPTS', opts);
        let depth = 1;
        for (let opt of opts) {
            let { path, parts, node, key } = opt;
            let type = node.t;
            let required = node.r;
            let dflt = node.v;
            let short = ((_a = node.m) === null || _a === void 0 ? void 0 : _a.short) || key;
            let lastpart = parts[parts.length - 1];
            while (depth < parts.length) {
                carn.add(`* _${parts[depth - 1]}_`);
                carn.depth(1);
                depth++;
            }
            while (parts.length < depth) {
                carn.depth(-1);
                depth--;
            }
            carn.add(`* _${lastpart}_: \`${type}\` ` +
                `${required ? '(required)' : '(default: ' + dflt + ')'} - ${short}`);
        }
    },
};
exports.GeneratorMap = GeneratorMap;
function resolve_generate(spec, ctx) {
    let generator = spec.generator;
    let format = spec.format;
    let gen_name = generator + '~' + format;
    let gen_func = GeneratorMap[gen_name];
    if (null === gen_func) {
        let errmsg = `Cannot find generator ${spec.generator} for ` + `format ${spec.format}`;
        if (ctx === null || ctx === void 0 ? void 0 : ctx.errs) {
            ctx === null || ctx === void 0 ? void 0 : ctx.errs.push(errmsg);
        }
        else {
            throw new Error(errmsg);
        }
    }
    return gen_func;
}
class GubuGen {
    constructor() { }
    generate(spec) {
        console.log('GUBUGEN:', spec);
        let genfunc = resolve_generate(spec);
        const carn = new carn_1.Carn();
        genfunc(spec.shape, carn);
        let text = load_file(spec.target);
        let out = carn.inject(text, spec.generator, MarkerMap[spec.format]);
        save_file(spec.target, out);
        return carn;
    }
}
exports.GubuGen = GubuGen;
function load_file(path) {
    return fs_1.default.readFileSync(path).toString();
}
function save_file(path, text) {
    return fs_1.default.writeFileSync(path, text);
}
//# sourceMappingURL=gubu-gen.js.map