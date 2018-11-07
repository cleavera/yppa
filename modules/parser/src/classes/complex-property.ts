import { Property } from './property';

export class ComplexProperty extends Property {
    public children: Array<Property>;

    constructor(properties: Array<Property>, name: string, bindingName: string | null = null, eventName: string | null = null) {
        super(name, bindingName, eventName);

        this.children = properties;
    }
}
