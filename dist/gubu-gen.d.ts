import type { GubuShape } from 'gubu';
import { Carn } from '@rjrodger/carn';
type Generator = (gs: GubuShape, carn: Carn) => void;
declare const MarkerMap: Record<string, string[]>;
declare const GeneratorMap: Record<string, Generator>;
type GenerateSpec = {
    shape: GubuShape;
    generator: string;
    format: string;
    target: string;
};
declare class GubuGen {
    constructor();
    generate(spec: GenerateSpec): Carn;
}
export type { Generator, GenerateSpec };
export { GubuGen, GeneratorMap, MarkerMap };
