import { Property } from './property';

export class ComplexProperty extends Property {
    public children: Array<Property>;

    constructor(properties: Array<Property>, name: string) {
        super(name);

        this.children = properties;
    }
}
