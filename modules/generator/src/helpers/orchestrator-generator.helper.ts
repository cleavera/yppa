import { Component, Property, Provider } from '@yppa/parser';
import { $providerGenerator } from './provider-generator.helper';
import { $templateGenerator } from './template-generator.helper';
import { $typeGenerator } from './type-generator.helper';

export function $orchestratorGenerator(component: Component): string {
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
            ${generateBindingString(component.inputs)}
            ${generateEventString(component.outputs)}
        }
    `;
}

function generateBindingString(inputs: Array<Property>): string {
    return inputs.reduce<string>((acc: string, input: Property): string => {
        acc += `
            public ${input.name} = ${$typeGenerator(input)};
        `;

        return acc;
    }, '');
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
