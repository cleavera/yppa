import { ComplexProperty, MethodProperty, NativeProperty, Property } from '@yppa/parser';
import { $generateObject } from './object-generator.helper';
import { $generateNativeProperty } from './property-generator.helper';

export function $generateMethodProperty(property: MethodProperty): () => unknown {
    const returnValue: Property = property.returnValue;

    if (returnValue instanceof MethodProperty) {
        return (): unknown => {
            return $generateMethodProperty(returnValue);
        };
    } else if (returnValue instanceof ComplexProperty) {
        return (): unknown => {
            return $generateObject(returnValue.children);
        };
    } else if (returnValue instanceof NativeProperty) {
        return (): unknown => {
            return $generateNativeProperty(returnValue);
        };
    }

    throw new Error(`Property type not recognized ${property.returnValue}`);
}
