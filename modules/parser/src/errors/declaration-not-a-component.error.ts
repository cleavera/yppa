import { ParseError } from './parse.error';

export class DeclarationNotAComponentError extends ParseError {
    constructor(name: string = 'Anonymous') {
        super(`${name} Declaration is not a component`);
    }
}
