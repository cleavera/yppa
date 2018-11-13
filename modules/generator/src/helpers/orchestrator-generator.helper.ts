import { Component, Property } from '@yppa/parser';
import { Declaration } from '../classes/declaration';
import { $templateGenerator } from './template-generator.helper';
import { $typeGenerator } from './type-generator.helper';

export function $orchestratorGenerator(component: Component): Declaration {
    const template: string = $templateGenerator(component.element);
    const name: string = `${component.name}DocumentationComponent`;

    return new Declaration(name, `
        @Component({
            template: \`${template}\`
        })
        export class ${name} {
            ${generateBindingString(component.inputs)}
            ${generateEventString(component.outputs)}
        }
    `, [
        {
            library: '@angular/core',
            name: 'Component'
        }
    ]);
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
