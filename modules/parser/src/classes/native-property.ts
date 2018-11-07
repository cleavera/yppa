import { NativeType } from '../constants/native-type.constant';
import { Property } from './property';

export class NativeProperty extends Property {
    public type: NativeType;

    constructor(type: NativeType, name: string, bindingName: string | null = null, eventName: string | null = null) {
        super(name, bindingName, eventName);

        this.type = type;
    }
}
