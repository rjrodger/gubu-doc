import type { GubuShape } from 'gubu';
import { Carn } from '@rjrodger/carn';
type Generator = (gs: GubuShape, carn: Carn) => void;
declare const MarkerMap: Record<string, string[]>;
declare const GeneratorMap: Record<string, Generator>;
declare class GubuGen {
    constructor();
    generate(spec: any): void;
}
export type { Generator };
export { GubuGen, GeneratorMap, MarkerMap };
