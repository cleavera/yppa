export class PropertyDoesNotHaveANameError extends Error {
    constructor(text: string) {
        super(`'${text}' is not a named property`);
    }
}
