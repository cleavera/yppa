import { ComplexProperty, MethodProperty, NativeProperty, Property } from '@yppa/parser';
import { $generateMethodProperty } from './method-generator.helper';
import { $generateNativeProperty } from './property-generator.helper';

export function $generateObject(properties: Array<Property>): any {
    return properties.reduce((acc: any, property: Property) => {
        if (property instanceof NativeProperty) {
            acc[property.name] = $generateNativeProperty(property);
        } else if (property instanceof ComplexProperty) {
            acc[property.name] = $generateObject(property.children);
        } else if (property instanceof MethodProperty) {
            acc[property.name] = $generateMethodProperty(property);
        }

        return acc;
    }, {});
}
