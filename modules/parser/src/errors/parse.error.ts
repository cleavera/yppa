import { $isUndefined } from '@cleavera/utils';

export abstract class ParseError extends Error {
    protected _location: Array<string> = [];

    protected constructor(message: string) {
        super(message);
    }

    public static appendLocation(error: Error, location: string): never {
        if (error instanceof ParseError) {
            const oldMessage: string = error.getMessage();

            error.addLocation(location);

            if (!$isUndefined(error.stack)) {
                error.stack = error.stack.replace(oldMessage, error.getMessage());
            }
        }

        throw error;
    }

    public getMessage(): string {
        if (this._location.length) {
            return `${this.message} - ${this._location.join('.')}`;
        }

        return `${this.message}`;
    }

    public addLocation(location: string): void {
        this._location.unshift(location);
    }
}
