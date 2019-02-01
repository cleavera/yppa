import { ArrayProperty } from '@yppa/parser';
import { $typeGenerator } from './type-generator.helper';

export function $generateArray(array: ArrayProperty): string {
    return `[${$typeGenerator(array.arrayType)}]`;
}
