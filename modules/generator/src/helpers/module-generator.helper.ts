import { Declaration } from '../classes/declaration';

export function $moduleGenerator(orchestrator: Declaration, providers: Array<Declaration>): Declaration {
    return new Declaration('DocumentationModule', `
        @NgModule({
            declarations: [
                ${orchestrator.name}
            ],
            providers: [
                ${providers.map((provider: Declaration) => provider.text).join(', ')}
            ],
            entryComponents: [
                ${orchestrator.name}
            ]
        })
        export class ${orchestrator.name}Module {}
    `, [
        {
            name: 'NgModule',
            library: '@angular/core'
        }
    ]);
}
