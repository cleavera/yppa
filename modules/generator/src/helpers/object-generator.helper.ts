import { ComplexProperty, MethodProperty, NativeProperty, Property } from '@yppa/parser';
import { $generateMethodProperty } from './method-generator.helper';
import { $generateNativeProperty } from './property-generator.helper';

export function $generateObject(properties: Array<Property>, scope: any = {}, path: Array<string> = []): any {
    return properties.reduce((acc: any, property: Property) => {
        const newPath: Array<string> = path.slice();

        newPath.push(property.name);

        if (property instanceof NativeProperty) {
            acc[newPath.join('.')] = $generateNativeProperty(property);
        } else if (property instanceof ComplexProperty) {
            $generateObject(property.children, acc, newPath);
        } else if (property instanceof MethodProperty) {
            acc[newPath.join('.')] = $generateMethodProperty(property);
        }

        return acc;
    }, scope);
}
