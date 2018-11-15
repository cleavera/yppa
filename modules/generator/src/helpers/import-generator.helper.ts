import { IDict, UniqueArray } from '@cleavera/utils';
import { Declaration } from '../classes/declaration';
import { IDependency } from '../interfaces/dependency';

export function $importGenerator(...declarations: Array<Declaration>): string {
    const declarationDictionary: IDict<Array<string>> = declarations.reduce<IDict<Array<string>>>((acc: IDict<Array<string>>, declaration: Declaration) => {
        declaration.dependencies.forEach((dependency: IDependency) => {
            if (!acc[dependency.library]) {
                acc[dependency.library] = new UniqueArray<string>();
            }

            acc[dependency.library].push(dependency.name);
        });

        return acc;
    }, {});

    let out: string = '';

    for (const library in declarationDictionary) {
        if (!declarationDictionary.hasOwnProperty(library)) {
            continue;
        }

        out += `import { ${declarationDictionary[library].join(', ')} } from '${library}';\n\t`;
    }

    return out;
}
