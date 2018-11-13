import { Maybe } from '@cleavera/utils/dist';

export class Property {
    public name: string;
    public bindingName: Maybe<string>;
    public eventName: Maybe<string>;

    constructor(name: string, bindingName: Maybe<string> = null, eventName: Maybe<string> = null) {
        this.name = name;
        this.bindingName = bindingName;
        this.eventName = eventName;
    }
}
