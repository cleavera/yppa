import { Provider } from '@yppa/parser';
import { $typeGenerator } from './type-generator.helper';

export function $providerGenerator(provider: Provider): string {
    return `{ provide: ${provider.tokenName}, useValue: ${$typeGenerator(provider.type)} }`;
}
