export class ProviderDoesNotHaveTokenError extends Error {
    constructor(text: string) {
        super(`${text} provider does not have a token`);
    }
}
