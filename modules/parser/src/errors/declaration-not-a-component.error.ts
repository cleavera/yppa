export class DeclarationNotAComponentError extends Error {
    constructor(name: string = 'Anonymous') {
        super(`${name} Declaration is not a component`);
    }
}
