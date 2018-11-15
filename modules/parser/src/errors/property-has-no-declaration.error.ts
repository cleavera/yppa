import { ParseError } from './parse.error';

export class PropertyHasNoDeclarationError extends ParseError {
    constructor(propertyName: string) {
        super(`Property '${propertyName} has no declaration`);
    }
}
