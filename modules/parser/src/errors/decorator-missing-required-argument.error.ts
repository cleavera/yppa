export class DecoratorMissingRequiredArgumentError extends Error {
    constructor(text: string) {
        super(`${text} decorator missing required argument`);
    }
}
