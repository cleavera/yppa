import { Property } from './property';

export class MethodProperty extends Property {
    public returnValue: Property;

    constructor(returnValue: Property, name: string) {
        super(name);

        this.returnValue = returnValue;
    }
}
