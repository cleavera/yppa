import { ClassInstancePropertyTypes, Symbol, Type } from 'ts-simple-ast';
import { NativeType } from '../constants/native-type.constant';
import { PropertyDoesNotHaveANameError } from '../errors/property-does-not-have-a-name.error';
import { NativeProperty } from './native-property';
import { Property } from './property';

export class PropertyFactory {
    public static FromProperty(member: ClassInstancePropertyTypes): Property {
        const type: Type = member.getType();
        const text: string = type.getText();
        const propertySymbol: Symbol | void = member.getSymbol();

        if (!propertySymbol) {
            throw new PropertyDoesNotHaveANameError(member.getText());
        }

        if (type.isString()) {
            return new NativeProperty(NativeType.string, propertySymbol.getName());
        } else if (type.isBoolean()) {
            return new NativeProperty(NativeType.boolean, propertySymbol.getName());
        } else if (type.isNumber()) {
            return new NativeProperty(NativeType.number, propertySymbol.getName());
        } else if (text === 'any' || text === 'unknown') {
            return new NativeProperty(NativeType.unknown, propertySymbol.getName());
        }

        return new Property(member.getText());
    }
}
