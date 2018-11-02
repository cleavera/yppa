import { Node, Symbol, Type } from 'ts-simple-ast';
import { NativeType } from '../constants/native-type.constant';
import { PropertyDoesNotHaveANameError } from '../errors/property-does-not-have-a-name.error';
import { PropertyHasNoDeclarationError } from '../errors/property-has-no-declaration.error';
import { ComplexProperty } from './complex-property';
import { NativeProperty } from './native-property';
import { Property } from './property';

export class PropertyFactory {
    public static FromProperty(type: Type, propertySymbol: Symbol | void): Property {
        const text: string = type.getText();

        if (!propertySymbol) {
            throw new PropertyDoesNotHaveANameError(type.getText());
        }

        if (type.isString()) {
            return new NativeProperty(NativeType.string, propertySymbol.getName());
        }

        if (type.isBoolean()) {
            return new NativeProperty(NativeType.boolean, propertySymbol.getName());
        }

        if (type.isNumber()) {
            return new NativeProperty(NativeType.number, propertySymbol.getName());
        }

        if (text === 'any' || text === 'unknown') {
            return new NativeProperty(NativeType.unknown, propertySymbol.getName());
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
