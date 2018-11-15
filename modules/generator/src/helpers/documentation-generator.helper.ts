import { Component, Provider } from '@yppa/parser';
import { Declaration } from '../classes/declaration';
import { $importGenerator } from './import-generator.helper';
import { $moduleGenerator } from './module-generator.helper';
import { $orchestratorGenerator } from './orchestrator-generator.helper';
import { $providerGenerator } from './provider-generator.helper';

export function $documentationGenerator(component: Component): string {
    const orchestrator: Declaration = $orchestratorGenerator(component);
    const providers: Array<Declaration> = component.providers.map((provider: Provider) => {
        return $providerGenerator(provider);
    });

    const module: Declaration = $moduleGenerator(orchestrator, providers, component);

    return `
        import 'reflect-metadata';
        import 'zone.js';

        ${$importGenerator(orchestrator, ...providers, module)}

        ${orchestrator.text}

        ${module.text}
    `;
}
