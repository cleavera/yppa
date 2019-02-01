import { Maybe } from '@cleavera/utils';
import { Property } from './property';

export class ArrayProperty extends Property {
    public arrayType: Property;

    constructor(type: Property, name: string, bindingName: Maybe<string> = null, eventName: Maybe<string> = null) {
        super(name, bindingName, eventName);

        this.arrayType = type;
    }
}
