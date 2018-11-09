import { Decorator, Node, Signature, StringLiteral, Symbol, Type } from 'ts-simple-ast';
import { NativeType } from '../constants/native-type.constant';
import { DecoratorNotStringError } from '../errors/decorator-not-string.error';
import { PropertyDoesNotHaveANameError } from '../errors/property-does-not-have-a-name.error';
import { PropertyHasNoDeclarationError } from '../errors/property-has-no-declaration.error';
import { ComplexProperty } from './complex-property';
import { MethodProperty } from './method-property';
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
                const argument: Node = decorator.getArguments()[0];

                if (argument) {
                    if (!(argument instanceof StringLiteral)) {
                        throw new DecoratorNotStringError(argument.getText());
                    }

                    bindingName = argument.getLiteralValue();
                } else {
                    bindingName = propertySymbol.getName();
                }
            }

            if (decorator.getName() === 'Output') {
                const argument: Node = decorator.getArguments()[0];

                if (argument) {
                    if (!(argument instanceof StringLiteral)) {
                        throw new DecoratorNotStringError(argument.getText());
                    }

                    eventName = argument.getLiteralValue();
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

        const callSignature: Array<Signature> = type.getCallSignatures();

        if (callSignature.length) {
            return new MethodProperty(this.FromProperty(callSignature[0].getReturnType(), propertySymbol), propertySymbol.getName());
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
