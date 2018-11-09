import { IDict, Maybe } from '@cleavera/utils';
import { Property } from './property';

export class Element {
    public tag: string;
    public attributes: IDict<Maybe<string>>;
    public propertyBindings: IDict<string>;
    public eventBindings: IDict<string>;
    public classNames: Array<string>;
    public selector: string;

    constructor(
        tag: string,
        attributes: IDict<Maybe<string>>,
        classNames: Array<string>,
        selector: string,
        propertyBindings: IDict<string>,
        eventBindings: IDict<string>
    ) {
        this.tag = tag;
        this.attributes = attributes;
        this.classNames = classNames;
        this.selector = selector;
        this.propertyBindings = propertyBindings;
        this.eventBindings = eventBindings;
    }

    public static FromSelector(selector: string, inputs: Array<Property>, outputs: Array<Property>): Element {
        const attributes: IDict<Maybe<string>> = {};

        selector = selector.replace(/\[([A-z-="']+?)]/g, (_match: string, attribute: string): '' => {
            const [attributeName, attributeValue]: [string, string?] = attribute.split('=') as [string, string?];

            attributes[attributeName] = attributeValue || null;

            return '';
        });

        const [tag, ...classNames]: Array<string> = selector.split('.') as Array<string>;

        const propertyBindings: IDict<string> = inputs.reduce<IDict<string>>((bindings: IDict<string>, property: Property): IDict<string> => {
            bindings[property.bindingName as string] = property.name;

            return bindings;
        }, {});

        const eventBindings: IDict<string> = outputs.reduce<IDict<string>>((bindings: IDict<string>, property: Property): IDict<string> => {
            bindings[property.eventName as string] = property.name;

            return bindings;
        }, {});

        return new Element(tag, attributes, classNames, selector, propertyBindings, eventBindings);
    }
}
