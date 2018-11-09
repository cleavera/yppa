export class DecoratorNotStringError extends Error {
    constructor(text: string) {
        super(`${text} decorator does not get passed a string`);
    }
}
