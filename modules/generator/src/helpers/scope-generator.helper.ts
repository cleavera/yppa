import { ComplexProperty, MethodProperty, NativeProperty, NativeType, Property } from '@yppa/parser';

export function $scopeGenerator(props: Array<Property>): any {
    return generateComplexProperty(props);
}

function generateComplexProperty(properties: Array<Property>, scope: any = {}, path: Array<string> = []): any {
    return properties.reduce((acc: any, property: Property) => {
        const newPath: Array<string> = path.slice();

        newPath.push(property.name);

        if (property instanceof NativeProperty) {
            acc[newPath.join('.')] = generateNativeProperty(property);
        } else if (property instanceof ComplexProperty) {
            generateComplexProperty(property.children, acc, newPath);
        } else if (property instanceof MethodProperty) {
            acc[newPath.join('.')] = generateMethodProperty(property);
        }

        return acc;
    }, scope);
}

function generateMethodProperty(property: MethodProperty): () => unknown {
    const returnValue: Property = property.returnValue;

    if (returnValue instanceof MethodProperty) {
        return (): unknown => {
            return generateMethodProperty(returnValue);
        };
    } else if (returnValue instanceof ComplexProperty) {
        return (): unknown => {
            return generateComplexProperty(returnValue.children);
        };
    } else if (returnValue instanceof NativeProperty) {
        return (): unknown => {
            return generateNativeProperty(returnValue);
        };
    }

    throw new Error(`Property type not recognized ${property}`);
}

function generateNativeProperty(property: NativeProperty): unknown {
    if (property.type === NativeType.string) {
        return 'String';
    }

    if (property.type === NativeType.number) {
        return 12;
    }

    if (property.type === NativeType.boolean) {
        return true;
    }

    return 'Unknown';
}
