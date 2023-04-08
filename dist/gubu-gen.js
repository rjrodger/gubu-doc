"use strict";
/* Copyright (c) 2023 Richard Rodger, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gen_GubuShape = void 0;
function gen_GubuShape(gs, carn) {
    carn.start();
    gs(undefined, {
        err: false,
        log: (point, state) => {
            var _a;
            if ('kv' === point) {
                let path = state.path.slice(1, state.dI + 1).join('.');
                let node = state.node;
                // console.log(state)
                let type = node.t;
                let required = node.r;
                let dflt = node.v;
                let short = ((_a = node.m) === null || _a === void 0 ? void 0 : _a.short) || state.key;
                carn.add(`* ${path}: ${type} ` +
                    `${required ? '(required)' : '(default: ' + dflt + ')'} - ${short}`);
            }
        }
    });
}
exports.gen_GubuShape = gen_GubuShape;
//# sourceMappingURL=gubu-gen.js.map