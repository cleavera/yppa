import { IAction } from '../interfaces/action.interface';

export class ActionFetcherService {
    public defaultAction: IAction = {
        url: 'http://bbc.co.uk',
        label: 'The beeb'
    };

    public getAction(label: string): IAction {
        return {
            url: 'http://google.com',
            label
        };
    }
}
