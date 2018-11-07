export class Property {
    public name: string;
    public bindingName: string | null;
    public eventName: string | null;

    constructor(name: string, bindingName: string | null = null, eventName: string | null = null) {
        this.name = name;
        this.bindingName = bindingName;
        this.eventName = eventName;
    }
}
