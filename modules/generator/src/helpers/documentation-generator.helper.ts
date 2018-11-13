import { Component, Provider } from '@yppa/parser/dist';
import { Declaration } from '../classes/declaration';
import { $importGenerator } from './import-generator.helper';
import { $moduleGenerator } from './module-generator.helper';
import { $orchestratorGenerator } from './orchestrator-generator.helper';
import { $providerGenerator } from './provider-generator.helper';
import { $generateTokens } from './token-generator.helper';

export function $documentationGenerator(component: Component): string {
    const orchestrator: Declaration = $orchestratorGenerator(component);
    const providers: Array<Declaration> = component.providers.map((provider: Provider) => {
        return $providerGenerator(provider);
    });

    const tokens: Array<Declaration> = $generateTokens(providers);

    const module: Declaration = $moduleGenerator(orchestrator, providers);

    return `
        ${$importGenerator(orchestrator, ...providers, module)}

        ${tokens.map((token: Declaration) => token.text)}

        ${orchestrator.text}

        ${module.text}
    `;
}
