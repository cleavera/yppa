import { ComplexProperty, MethodProperty, NativeProperty, Provider } from '@yppa/parser';
import { PropertyNotImplementedError } from '../errors/property-not-implemented.error';
import { $generateMethodProperty } from './method-generator.helper';
import { $generateObject } from './object-generator.helper';
import { $generateNativeProperty } from './property-generator.helper';

export function $providerGenerator(provider: Provider): string {
    let property: any;

    if (provider.type instanceof NativeProperty) {
        property = $generateNativeProperty(provider.type);
    } else if (provider.type instanceof ComplexProperty) {
        property = $generateObject(provider.type.children);
    } else if (provider.type instanceof MethodProperty) {
        property = $generateMethodProperty(provider.type);
    } else {
        throw new PropertyNotImplementedError(provider.type);
    }

    return `{ provide: ${provider.tokenName}, useValue: ${JSON.stringify(property)} }`;
}
