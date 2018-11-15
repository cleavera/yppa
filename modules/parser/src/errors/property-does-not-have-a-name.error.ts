import { ParseError } from './parse.error';

export class PropertyDoesNotHaveANameError extends ParseError {
    constructor(text: string) {
        super(`'${text}' is not a named property`);
    }
}
