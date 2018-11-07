import { Decorator, Node, Symbol, Type } from 'ts-simple-ast';
import { NativeType } from '../constants/native-type.constant';
import { PropertyDoesNotHaveANameError } from '../errors/property-does-not-have-a-name.error';
import { PropertyHasNoDeclarationError } from '../errors/property-has-no-declaration.error';
import { ComplexProperty } from './complex-property';
import { NativeProperty } from './native-property';
import { Property } from './property';

export class PropertyFactory {
    public static FromProperty(type: Type, propertySymbol: Symbol | void, decorators: Array<Decorator> = []): Property {
        if (!propertySymbol) {
            throw new PropertyDoesNotHaveANameError(type.getText());
        }

        const text: string = type.getText();

        let bindingName: string | null = null;
        let eventName: string | null = null;

        decorators.forEach((decorator: Decorator) => {
            if (decorator.getName() === 'Input') {
                if (decorator.getArguments()[0]) {
                    bindingName = decorator.getArguments()[0].getText();
                } else {
                    bindingName = propertySymbol.getName();
                }
            }

            if (decorator.getName() === 'Output') {
                if (decorator.getArguments()[0]) {
                    eventName = decorator.getArguments()[0].getText();
                } else {
                    eventName = propertySymbol.getName();
                }
            }
        });

        if (type.isString()) {
            return new NativeProperty(NativeType.string, propertySymbol.getName(), bindingName, eventName);
        }

        if (type.isBoolean()) {
            return new NativeProperty(NativeType.boolean, propertySymbol.getName(), bindingName, eventName);
        }

        if (type.isNumber()) {
            return new NativeProperty(NativeType.number, propertySymbol.getName(), bindingName, eventName);
        }

        if (text === 'any' || text === 'unknown') {
            return new NativeProperty(NativeType.unknown, propertySymbol.getName(), bindingName, eventName);
        }

        const properties: Array<Symbol> = type.getProperties();

        if (properties.length) {
            return new ComplexProperty(properties.map((child: Symbol) => {
                const declaration: Node | void = child.getValueDeclaration();

                if (!declaration) {
                    throw new PropertyHasNoDeclarationError(child.getName());
                }

                return this.FromProperty(declaration.getType(), child);
            }), propertySymbol.getName());
        }

        return new Property(propertySymbol.getName());
    }
}
