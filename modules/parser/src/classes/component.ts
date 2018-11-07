import { readFileSync } from 'fs';
import { join } from 'path';

import { ClassDeclaration, Decorator, Expression, NoSubstitutionTemplateLiteral, ObjectLiteralElementLike, ObjectLiteralExpression, PropertyAssignment, PropertyDeclaration, StringLiteral, Symbol } from 'ts-simple-ast';
import { ClassDoesNotHaveANameError } from '../errors/class-does-not-have-a-name.error';
import { DeclarationNotAComponentError } from '../errors/declaration-not-a-component.error';
import { ExpressionNotLiteralValueError } from '../errors/expression-not-literal-value.error';
import { PropertyDoesNotHaveANameError } from '../errors/property-does-not-have-a-name.error';
import { Property } from './property';
import { PropertyFactory } from './property-factory';

export class Component {
    public properties: Array<Property>;
    public inputs: Array<Property>;
    public outputs: Array<Property>;
    public name: string;
    public selector: string;
    public template: string;

    constructor(properties: Array<Property>, selector: string, template: string, name: string) {
        this.selector = selector;
        this.template = template;
        this.name = name;
        this.properties = properties;

        this.inputs = properties.filter((property: Property) => {
            return !!property.bindingName;
        });

        this.outputs = properties.filter((property: Property) => {
            return !!property.eventName;
        });
    }

    public static FromDeclaration(declaration: ClassDeclaration): Component {
        let isComponent: boolean = false;
        let selector: string = '';
        let template: string = '';

        declaration.getDecorators().forEach((decorator: Decorator) => {
            if (decorator.getName() === 'Component') {
                isComponent = true;
            }

            decorator.getArguments().forEach((arg: ObjectLiteralExpression) => {
                arg.getProperties().forEach((prop: ObjectLiteralElementLike) => {
                    const propertySymbol: Symbol | void = prop.getSymbol();

                    if (!propertySymbol) {
                        throw new PropertyDoesNotHaveANameError(prop.getText());
                    }

                    if (propertySymbol.getName() === 'selector') {
                        selector = this.getLiteralValue(prop);
                    } else if (propertySymbol.getName() === 'templateUrl') {
                        const path: string = join(declaration.getSourceFile().getDirectoryPath(), this.getLiteralValue(prop));

                        template = readFileSync(path).toString();
                    } else if (propertySymbol.getName() === 'template') {
                        template = this.getLiteralValue(prop);
                    }
                });
            });
        });

        if (!isComponent) {
            throw new DeclarationNotAComponentError(declaration.getName());
        }

        const properties: Array<Property> = declaration.getInstanceProperties().map((property: PropertyDeclaration): Property => {
            return PropertyFactory.FromProperty(property.getType(), property.getSymbol(), property.getDecorators());
        });

        const symbol: Symbol | void = declaration.getSymbol();

        if (!symbol) {
            throw new ClassDoesNotHaveANameError(declaration.getText());
        }

        return new Component(properties, selector, template, symbol.getName());
    }

    private static getLiteralValue(prop: ObjectLiteralElementLike): string {
        if (!(prop instanceof PropertyAssignment)) {
            throw new ExpressionNotLiteralValueError(prop.getText());
        }

        const initializer: Expression | undefined = prop.getInitializer();

        if (!initializer || !((initializer instanceof StringLiteral) || (initializer instanceof NoSubstitutionTemplateLiteral))) {
            throw new ExpressionNotLiteralValueError(prop.getText());
        }

        return initializer.getLiteralValue();
    }
}
