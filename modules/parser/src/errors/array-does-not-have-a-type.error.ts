import { ParseError } from './parse.error';

export class ArrayDoesNotHaveATypeError extends ParseError {
    constructor(text: string) {
        super(`'${text}' array does not have a type`);
    }
}
