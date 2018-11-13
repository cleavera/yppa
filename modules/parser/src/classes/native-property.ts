import { Maybe } from '@cleavera/utils/dist';
import { NativeType } from '../constants/native-type.constant';
import { Property } from './property';

export class NativeProperty extends Property {
    public type: NativeType;

    constructor(type: NativeType, name: string, bindingName: Maybe<string> = null, eventName: Maybe<string> = null) {
        super(name, bindingName, eventName);

        this.type = type;
    }
}
