import { ParseError } from './parse.error';

export class ProviderDoesNotHaveTokenError extends ParseError {
    constructor(text: string) {
        super(`${text} provider does not have a token`);
    }
}
