import { ClassDeclaration, ClassInstancePropertyTypes, Decorator, Expression, ObjectLiteralElementLike, ObjectLiteralExpression, PropertyAssignment, Symbol } from 'ts-simple-ast';
import { ComponentDoesNotHaveStaticSelectorError } from '../errors/component-does-not-have-static-selector.error';
import { DeclarationNotAComponentError } from '../errors/declaration-not-a-component.error';
import { PropertyDoesNotHaveANameError } from '../errors/property-does-not-have-a-name.error';
import { Property } from './property';
import { PropertyFactory } from './property-factory';

export class Component {
    public properties: Array<Property>;
    public selector: string;

    constructor(properties: Array<Property>, selector: string) {
        this.properties = properties;
        this.selector = selector;
    }

    public static FromDeclaration(declaration: ClassDeclaration): Component {
        let isComponent: boolean = false;
        let selector: string = '';

        declaration.getDecorators().forEach((decorator: Decorator) => {
            if (decorator.getName() === 'Component') {
                isComponent = true;
            }

            decorator.getArguments().forEach((arg: ObjectLiteralExpression) => {
                arg.getProperties().forEach((prop: ObjectLiteralElementLike) => {
                    const symbol: Symbol | void = prop.getSymbol();

                    if (!symbol) {
                        throw new PropertyDoesNotHaveANameError(prop.getText());
                    }

                    if (symbol.getName() === 'selector') {
                        if (!(prop instanceof PropertyAssignment)) {
                            throw new ComponentDoesNotHaveStaticSelectorError(declaration.getText());
                        }

                        const initializer: Expression | undefined = prop.getInitializer();

                        if (!initializer) {
                            throw new ComponentDoesNotHaveStaticSelectorError(declaration.getText());
                        }

                        selector = initializer.getText();
                    }
                });
            });
        });

        if (!selector) {
            throw new ComponentDoesNotHaveStaticSelectorError(declaration.getText());
        }

        if (!isComponent) {
            throw new DeclarationNotAComponentError(declaration.getName());
        }

        const properties: Array<Property> = declaration.getInstanceProperties().map((property: ClassInstancePropertyTypes): Property => {
            return PropertyFactory.FromProperty(property);
        });

        return new Component(properties, selector);
    }
}
