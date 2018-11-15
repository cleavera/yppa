import { ParseError } from './parse.error';

export class ExpressionNotLiteralValueError extends ParseError {
    constructor(component: string) {
        super(`${component} does not have a static template`);
    }
}
