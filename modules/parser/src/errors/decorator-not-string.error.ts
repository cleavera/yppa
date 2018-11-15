import { ParseError } from './parse.error';

export class DecoratorNotStringError extends ParseError {
    constructor(text: string) {
        super(`${text} decorator does not get passed a string`);
    }
}
