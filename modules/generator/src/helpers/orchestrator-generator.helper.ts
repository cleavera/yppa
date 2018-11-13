import { IDict } from '@cleavera/utils';
import { Component, Property, Provider } from '@yppa/parser';
import { $generateObject } from './object-generator.helper';
import { $providerGenerator } from './provider-generator.helper';
import { $templateGenerator } from './template-generator.helper';

export function $orchestratorGenerator(component: Component): string {
    const inputs: IDict<any> = $generateObject(component.inputs);
    const template: string = $templateGenerator(component.element);

    return `
        import { Component } from '@angular/core';

        ${generateTokens(component.providers)}

        @Component({
            providers: [${component.providers.map((provider: Provider) => {
                return $providerGenerator(provider);
            }).join(', ')}],
            template: \`${template}\`
        })
        export class ${component.name}DocumentationComponent {
            ${generateBindingString(inputs)}
            ${generateEventString(component.outputs)}
        }
    `;
}

function generateBindingString(scope: IDict<any>): string {
    let properties: string = '';

    for (const key in scope) {
        if (!scope.hasOwnProperty(key)) {
            continue;
        }

        properties += `
            public ${key} = ${JSON.stringify(scope[key])};
        `;
    }

    return properties;
}

function generateEventString(outputs: Array<Property>): string {
    return outputs.reduce<string>((acc: string, output: Property): string => {
        acc += `
            public ${output.name}(...args: any[]) {
                console.log(args);
            }
        `;

        return acc;
    }, '');
}

function generateTokens(providers: Array<Provider>): string {
    return providers.reduce<string>((acc: string, provider: Provider) => {
        acc += `
        class ${provider.tokenName} {}
        `;

        return acc;
    }, '');
}
