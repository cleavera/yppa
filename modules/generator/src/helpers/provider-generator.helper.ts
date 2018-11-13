import { Provider } from '@yppa/parser';
import { Declaration } from '../classes/declaration';
import { $typeGenerator } from './type-generator.helper';

export function $providerGenerator(provider: Provider): Declaration {
    return new Declaration(provider.tokenName, `{ provide: ${provider.tokenName}, useValue: ${$typeGenerator(provider.type)} }`);
}
