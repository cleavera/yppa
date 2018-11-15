import { Component } from '@yppa/parser';
import { Declaration } from '../classes/declaration';

export function $moduleGenerator(orchestrator: Declaration, providers: Array<Declaration>, component: Component): Declaration {
    const moduleName: string = `${orchestrator.name}Module`;

    return new Declaration('DocumentationModule', `
        @NgModule({
            declarations: [
                ${orchestrator.name},
                ${component.name}
            ],
            providers: [
                ${providers.map((provider: Declaration) => provider.text).join(', ')}
            ],
            imports: [
                BrowserModule
            ],
            bootstrap: [
                ${orchestrator.name}
            ]
        })
        export class ${moduleName} {}

        platformBrowserDynamic().bootstrapModule(${moduleName});
    `, [
        {
            name: 'BrowserModule',
            library: '@angular/platform-browser'
        },
        {
            name: 'NgModule',
            library: '@angular/core'
        },
        {
            name: 'platformBrowserDynamic',
            library: '@angular/platform-browser-dynamic'
        },
        {
            library: component.path,
            name: component.name
        }
    ]);
}
