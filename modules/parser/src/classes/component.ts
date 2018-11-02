import { readFileSync } from 'fs';
import { join } from 'path';

import { ClassDeclaration, Decorator, Expression, NoSubstitutionTemplateLiteral, ObjectLiteralElementLike, ObjectLiteralExpression, PropertyAssignment, PropertyDeclaration, StringLiteral, Symbol } from 'ts-simple-ast';
import { DeclarationNotAComponentError } from '../errors/declaration-not-a-component.error';
import { ExpressionNotLiteralValueError } from '../errors/expression-not-literal-value.error';
import { PropertyDoesNotHaveANameError } from '../errors/property-does-not-have-a-name.error';
import { Property } from './property';
import { PropertyFactory } from './property-factory';

export class Component {
    public properties: Array<Property>;
    public selector: string;
    public template: string;

    constructor(properties: Array<Property>, selector: string, template: string) {
        this.properties = properties;
        this.selector = selector;
        this.template = template;
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
                    const symbol: Symbol | void = prop.getSymbol();

                    if (!symbol) {
                        throw new PropertyDoesNotHaveANameError(prop.getText());
                    }

                    if (symbol.getName() === 'selector') {
                        selector = this.getLiteralValue(prop);
                    } else if (symbol.getName() === 'templateUrl') {
                        const path: string = join(declaration.getSourceFile().getDirectoryPath(), this.getLiteralValue(prop));

                        template = readFileSync(path).toString();
                    } else if (symbol.getName() === 'template') {
                        template = this.getLiteralValue(prop);
                    }
                });
            });
        });

        if (!isComponent) {
            throw new DeclarationNotAComponentError(declaration.getName());
        }

        const properties: Array<Property> = declaration.getInstanceProperties().map((property: PropertyDeclaration): Property => {
            return PropertyFactory.FromProperty(property.getType(), property.getSymbol());
        });

        return new Component(properties, selector, template);
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
