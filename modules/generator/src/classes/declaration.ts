import { IDependency } from '../interfaces/dependency';

export class Declaration {
    public dependencies: Array<IDependency>;
    public name: string;
    public text: string;

    constructor(name: string, text: string, dependencies: Array<IDependency> = []) {
        this.name = name;
        this.text = text;
        this.dependencies = dependencies;
    }
}
