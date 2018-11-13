import { Property } from '@yppa/parser';

export class PropertyNotImplementedError extends Error {
    constructor(property: Property) {
        super(`${property} not implemented`);
    }
}
