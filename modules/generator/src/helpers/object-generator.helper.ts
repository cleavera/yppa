import { Property } from '@yppa/parser';
import { $typeGenerator } from './type-generator.helper';

export function $generateObject(properties: Array<Property>): string {
    return `{${properties.reduce<string>((acc: string, property: Property) => {
        return acc + `${property.name}: ${$typeGenerator(property)},`;
    }, '')}}`;
}
