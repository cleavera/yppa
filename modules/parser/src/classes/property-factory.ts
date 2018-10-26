import { ClassInstancePropertyTypes, Type } from 'ts-simple-ast';
import { NativeType } from '../constants/native-type.constant';
import { NativeProperty } from './native-property';
import { Property } from './property';

export class PropertyFactory {
    public static FromProperty(member: ClassInstancePropertyTypes): Property {
        const type: Type = member.getType();
        const text: string = type.getText();

        if (type.isString()) {
            return new NativeProperty(NativeType.string);
        } else if (type.isBoolean()) {
            return new NativeProperty(NativeType.boolean);
        } else if (type.isNumber()) {
            return new NativeProperty(NativeType.number);
        } else if (text === 'any' || text === 'unknown') {
            return new NativeProperty(NativeType.unknown);
        }

        return new Property();
    }
}
