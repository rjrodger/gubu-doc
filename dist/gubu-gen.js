"use strict";
/* Copyright (c) 2023 Richard Rodger, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkerMap = exports.GeneratorMap = void 0;
const MarkerMap = {
    md: ['<!--', '-->'],
};
exports.MarkerMap = MarkerMap;
const GeneratorMap = {
    'options~md': function (gs, carn) {
        var _a;
        carn.start();
        carn.add('## Options');
        let opts = [];
        gs(undefined, {
            err: false,
            log: (point, state) => {
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
//# sourceMappingURL=gubu-gen.js.map