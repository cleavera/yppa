import { NativeProperty, NativeType, Property } from '@yppa/parser';

export function $scopeGenerator(props: Array<Property>): any {
    return props.reduce((acc: any, property: Property) => {
        if (property instanceof NativeProperty) {
            if (property.type === NativeType.string) {
                acc[property.name] = 'String';
            } else if (property.type === NativeType.number) {
                acc[property.name] = 12;
            } else if (property.type === NativeType.boolean) {
                acc[property.name] = true;
            } else {
                acc[property.name] = 'Unknown';
            }
        }

        return acc;
    }, {});
}
