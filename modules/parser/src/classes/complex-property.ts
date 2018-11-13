import { Maybe } from '@cleavera/utils/dist';
import { Property } from './property';

export class ComplexProperty extends Property {
    public children: Array<Property>;

    constructor(properties: Array<Property>, name: string, bindingName: Maybe<string> = null, eventName: Maybe<string> = null) {
        super(name, bindingName, eventName);

        this.children = properties;
    }
}
