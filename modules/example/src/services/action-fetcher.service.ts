import { IAction } from '../interfaces/action.interface';

export class ActionFetcherService {
    public defaultAction: IAction = {
        url: 'http://bbc.co.uk',
        label: 'The beeb'
    };

    public getActions(label: string): Array<IAction> {
        return [{
            url: 'http://google.com',
            label
        }];
    }
}
