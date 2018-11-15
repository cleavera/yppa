import { $isNull, Maybe } from '@cleavera/utils';
import { readFileSync } from 'fs';
import { join } from 'path';

import { ClassDeclaration, ConstructorDeclaration, Decorator, Expression, NoSubstitutionTemplateLiteral, ObjectLiteralElementLike, ObjectLiteralExpression, ParameterDeclaration, PropertyAssignment, PropertyDeclaration, StringLiteral, Symbol } from 'ts-simple-ast';
import { ClassDoesNotHaveANameError } from '../errors/class-does-not-have-a-name.error';
import { DeclarationNotAComponentError } from '../errors/declaration-not-a-component.error';
import { ExpressionNotLiteralValueError } from '../errors/expression-not-literal-value.error';
import { PropertyDoesNotHaveANameError } from '../errors/property-does-not-have-a-name.error';
import { Element } from './element';
import { Property } from './property';
import { PropertyFactory } from './property-factory';
import { Provider } from './provider';

export class Component {
    public properties: Array<Property>;
    public inputs: Array<Property>;
    public outputs: Array<Property>;
    public providers: Array<Provider>;
    public element: Element;
    public name: string;
    public template: string;
    public path: string;

    constructor(properties: Array<Property>, selector: string, template: string, name: string, providers: Array<Provider>, path: string) {
        this.template = template;
        this.name = name;
        this.path = path;
        this.providers = providers;
        this.properties = properties;
        this.inputs = properties.filter((property: Property) => {
            return !!property.bindingName;
        });

        this.outputs = properties.filter((property: Property) => {
            return !!property.eventName;
        });

        this.element = Element.FromSelector(selector, this.inputs, this.outputs);
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
                    const propertySymbol: Maybe<Symbol> = prop.getSymbol() || null;

                    if ($isNull(propertySymbol)) {
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

        const providers: Array<Provider> = declaration
            .getConstructors()
            .reduce<Array<Provider>>((arr: Array<Provider>, constructor: ConstructorDeclaration): Array<Provider> => {
                return arr.concat(constructor.getParameters().map((parameter: ParameterDeclaration): Provider => {
                    return Provider.FromType(parameter.getType(), parameter.getSymbol(), parameter.getDecorators());
                }));
        }, []);

        const properties: Array<Property> = declaration.getInstanceProperties().map((property: PropertyDeclaration): Property => {
            return PropertyFactory.FromProperty(property.getType(), property.getSymbol(), [], property.getDecorators());
        });

        const symbol: Maybe<Symbol> = declaration.getSymbol() || null;

        if ($isNull(symbol)) {
            throw new ClassDoesNotHaveANameError(declaration.getText());
        }

        return new Component(properties, selector, template, symbol.getName(), providers, declaration.getSourceFile().getFilePath());
    }

    private static getLiteralValue(prop: ObjectLiteralElementLike): string {
        if (!(prop instanceof PropertyAssignment)) {
            throw new ExpressionNotLiteralValueError(prop.getText());
        }

        const initializer: Maybe<Expression> = prop.getInitializer() || null;

        if ($isNull(initializer) || !((initializer instanceof StringLiteral) || (initializer instanceof NoSubstitutionTemplateLiteral))) {
            throw new ExpressionNotLiteralValueError(prop.getText());
        }

        return initializer.getLiteralValue();
    }
}
