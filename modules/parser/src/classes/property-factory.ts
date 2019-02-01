import { $isNull, Maybe } from '@cleavera/utils';
import { Decorator, Node, Signature, StringLiteral, Symbol, Type } from 'ts-simple-ast';
import { MAX_SEARCH_DEPTH } from '../constants/max-search-depth.constant';
import { NativeType } from '../constants/native-type.constant';
import { ArrayDoesNotHaveATypeError } from '../errors/array-does-not-have-a-type.error';
import { DecoratorNotStringError } from '../errors/decorator-not-string.error';
import { ParseError } from '../errors/parse.error';
import { PropertyDoesNotHaveANameError } from '../errors/property-does-not-have-a-name.error';
import { PropertyHasNoDeclarationError } from '../errors/property-has-no-declaration.error';
import { ArrayProperty } from './array-property';
import { ComplexProperty } from './complex-property';
import { MethodProperty } from './method-property';
import { NativeProperty } from './native-property';
import { Property } from './property';

export class PropertyFactory {
    public static FromProperty(type: Type, propertySymbol: Maybe<Symbol> = null, parsedTypes: Array<string> = [], decorators: Array<Decorator> = [], depth: number = 0): Property {
        if ($isNull(propertySymbol)) {
            throw new PropertyDoesNotHaveANameError(type.getText());
        }

        depth++;

        const text: string = type.getText();

        let bindingName: Maybe<string> = null;
        let eventName: Maybe<string> = null;

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

        if (type.isArray()) {
            const arrayType: Maybe<Type> = type.getArrayType() || null;

            if ($isNull(arrayType)) {
                throw new ArrayDoesNotHaveATypeError(propertySymbol.getName());
            }

            return new ArrayProperty(this.FromProperty(arrayType, arrayType.getSymbol(), parsedTypes.slice(), undefined, depth), propertySymbol.getName(), bindingName, eventName);
        }

        if (text === 'any' || text === 'unknown' || parsedTypes.indexOf(text) > -1) {
            return new NativeProperty(NativeType.unknown, propertySymbol.getName(), bindingName, eventName);
        }

        if (type.isString()) {
            return new NativeProperty(NativeType.string, propertySymbol.getName(), bindingName, eventName);
        }

        if (type.isBoolean()) {
            return new NativeProperty(NativeType.boolean, propertySymbol.getName(), bindingName, eventName);
        }

        if (type.isNumber()) {
            return new NativeProperty(NativeType.number, propertySymbol.getName(), bindingName, eventName);
        }

        parsedTypes.push(text);

        const callSignature: Array<Signature> = type.getCallSignatures();

        if (callSignature.length) {
            try {
                return new MethodProperty(this.FromProperty(callSignature[0].getReturnType(), propertySymbol, parsedTypes.slice(), undefined, depth), propertySymbol.getName());
            } catch (e) {
                return ParseError.appendLocation(e, propertySymbol.getName());
            }
        }

        const properties: Array<Symbol> = type.getProperties();

        if (properties.length && depth < MAX_SEARCH_DEPTH()) {
            return new ComplexProperty(properties.map((child: Symbol) => {
                const declaration: Maybe<Node> = child.getValueDeclaration() || null;

                if ($isNull(declaration)) {
                    throw new PropertyHasNoDeclarationError(child.getName());
                }

                try {
                    return this.FromProperty(declaration.getType(), child, parsedTypes.slice(), undefined, depth);
                } catch (e) {
                    return ParseError.appendLocation(e, propertySymbol.getName());
                }
            }), propertySymbol.getName(), bindingName, eventName);
        }

        return new Property(propertySymbol.getName());
    }
}
