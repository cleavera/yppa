import { $isNull } from '@cleavera/utils';
import { Provider } from '@yppa/parser';
import { Declaration } from '../classes/declaration';
import { IDependency } from '../interfaces/dependency';
import { $typeGenerator } from './type-generator.helper';

export function $providerGenerator(provider: Provider): Declaration {
    const dependencies: Array<IDependency> = [];

    if (!$isNull(provider.path)) {
        dependencies.push({
            library: provider.path,
            name: provider.tokenName
        });
    }

    return new Declaration(
        provider.tokenName,
        `{ provide: ${provider.tokenName}, useValue: ${$typeGenerator(provider.type)} }`,
        dependencies
    );
}
