import { ClassDeclaration, ClassInstancePropertyTypes, Decorator } from 'ts-simple-ast';
import { DeclarationNotAComponentError } from '../errors/declaration-not-a-component.error';
import { Property } from './property';
import { PropertyFactory } from './property-factory';

export class Component {
    public properties: Array<Property>;

    constructor(properties: Array<Property>) {
        this.properties = properties;
    }

    public static FromDeclaration(declaration: ClassDeclaration): Component {
        let isComponent: boolean = false;
        declaration.getDecorators().forEach((decorator: Decorator) => {
            if (decorator.getName() === 'Component') {
                isComponent = true;
            }
        });

        if (!isComponent) {
            throw new DeclarationNotAComponentError(declaration.getName());
        }

        const properties: Array<Property> = declaration.getInstanceProperties().map((property: ClassInstancePropertyTypes): Property => {
            return PropertyFactory.FromProperty(property);
        });

        return new Component(properties);
    }
}
