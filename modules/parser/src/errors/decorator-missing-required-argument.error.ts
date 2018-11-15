import { ParseError } from './parse.error';

export class DecoratorMissingRequiredArgumentError extends ParseError {
    constructor(text: string) {
        super(`${text} decorator missing required argument`);
    }
}
