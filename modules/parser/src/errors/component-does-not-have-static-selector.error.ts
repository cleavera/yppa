export class ComponentDoesNotHaveStaticSelectorError extends Error {
    constructor(component: string) {
        super(`${component} does not have a static selector`);
    }
}
