import { $isNull, $isUndefined, Maybe } from '@cleavera/utils';
import { Decorator, Node, Symbol, Type } from 'ts-simple-ast';
import { DecoratorMissingRequiredArgumentError } from '../errors/decorator-missing-required-argument.error';
import { ParseError } from '../errors/parse.error';
import { ProviderDoesNotHaveTokenError } from '../errors/provider-does-not-have-token.error';
import { Property } from './property';
import { PropertyFactory } from './property-factory';

export class Provider {
    public type: Property;
    public path: Maybe<string>;
    public tokenName: string;

    constructor(type: Property, tokenName: string, path: Maybe<string> = null) {
        this.type = type;
        this.path = path;
        this.tokenName = tokenName;
    }

    public static FromType(type: Type, symbol: Maybe<Symbol> = null, decorators: Array<Decorator> = []): Provider {
        let tokenName: Maybe<string> = null;
        const typeSymbol: Maybe<Symbol> = type.getSymbol() || null;
        let path: Maybe<string> = null;

        if (!$isNull(typeSymbol)) {
            tokenName = typeSymbol.getName();

            path = typeSymbol.getDeclarations()[0].getSourceFile().getFilePath();
        }

        decorators.forEach((decorator: Decorator) => {
            if (decorator.getName() === 'Inject') {
                const args: Array<Node> = decorator.getArguments();

                if ($isUndefined(args[0])) {
                    throw new DecoratorMissingRequiredArgumentError(decorator.getText());
                }

                tokenName = args[0].getText();
            }
        });

        if ($isNull(tokenName)) {
            throw new ProviderDoesNotHaveTokenError(type.getText());
        }

        try {
            return new Provider(PropertyFactory.FromProperty(type, symbol), tokenName, path);
        } catch (e) {
            return ParseError.appendLocation(e, tokenName);
        }
    }
}
