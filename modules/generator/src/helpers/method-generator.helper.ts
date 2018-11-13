import { MethodProperty } from '@yppa/parser';
import { $typeGenerator } from './type-generator.helper';

export function $generateMethodProperty(property: MethodProperty): string {
    return `() => { return ${$typeGenerator(property.returnValue)}; }`;
}
