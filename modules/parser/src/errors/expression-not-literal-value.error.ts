export class ExpressionNotLiteralValueError extends Error {
    constructor(component: string) {
        super(`${component} does not have a static template`);
    }
}
