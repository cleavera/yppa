import { $isNull, Maybe } from '@cleavera/utils/dist';
import { Element } from '@yppa/parser/';

export function $templateGenerator(element: Element): string {
    let template: string = `<${element.tag}`;

    if (element.classNames.length) {
        template += ` class="${element.classNames.join(' ')}"`;
    }

    for (const attribute in element.attributes) {
        if (!element.attributes.hasOwnProperty(attribute)) {
            continue;
        }

        template += ` ${attribute}`;

        const value: Maybe<string> = element.attributes[attribute];

        if (!$isNull(value)) {
            template += `=${value}`;
        }
    }

    for (const property in element.propertyBindings) {
        if (!element.propertyBindings.hasOwnProperty(property)) {
            continue;
        }

        template += ` [${property}]="${element.propertyBindings[property]}"`;
    }

    for (const event in element.eventBindings) {
        if (!element.eventBindings.hasOwnProperty(event)) {
            continue;
        }

        template += ` (${event})="${element.eventBindings[event]}"`;
    }

    template += `></${element.tag}>`;

    return template;
}
