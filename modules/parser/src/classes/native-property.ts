import { NativeType } from '../constants/native-type.constant';
import { Property } from './property';

export class NativeProperty extends Property {
    public type: NativeType;

    constructor(type: NativeType) {
        super();

        this.type = type;
    }
}
