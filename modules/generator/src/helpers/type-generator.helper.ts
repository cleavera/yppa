import { ArrayProperty, ComplexProperty, MethodProperty, NativeProperty, Property } from '@yppa/parser';
import { $generateArray } from './array-generator.helper';
import { $generateMethodProperty } from './method-generator.helper';
import { $generateObject } from './object-generator.helper';
import { $generateNativeProperty } from './property-generator.helper';

export function $typeGenerator(type: Property): string {
    if (type instanceof NativeProperty) {
        return JSON.stringify($generateNativeProperty(type));
    } else if (type instanceof ComplexProperty) {
        return $generateObject(type.children);
    } else if (type instanceof MethodProperty) {
        return $generateMethodProperty(type);
    } else if (type instanceof ArrayProperty) {
        return $generateArray(type);
    } else {
        return '{}';
    }
}
