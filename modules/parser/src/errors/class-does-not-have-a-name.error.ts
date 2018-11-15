import { ParseError } from './parse.error';

export class ClassDoesNotHaveANameError extends ParseError {
    constructor(text: string) {
        super(`'${text}' is not a named class`);
    }
}
