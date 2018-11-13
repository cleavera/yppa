import { NativeProperty, NativeType } from '@yppa/parser';

export function $generateNativeProperty(property: NativeProperty): string | number | boolean {
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
