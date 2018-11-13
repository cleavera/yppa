import { Declaration } from '../classes/declaration';

export function $generateTokens(providers: Array<Declaration>): Array<Declaration> {
    return providers.map<Declaration>((provider: Declaration) => {
        return new Declaration(provider.name, `
        class ${provider.name} {}
        `);
    });
}
