export class ClassDoesNotHaveANameError extends Error {
    constructor(text: string) {
        super(`'${text}' is not a named class`);
    }
}
