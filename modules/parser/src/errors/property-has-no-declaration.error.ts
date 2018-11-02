export class PropertyHasNoDeclarationError extends Error {
    constructor(propertyName: string) {
        super(`Property '${propertyName} has no declaration`);
    }
}
