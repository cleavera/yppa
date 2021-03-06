import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAction } from '../../interfaces/action.interface';
import { ActionFetcherService } from '../../services/action-fetcher.service';

@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    @Input()
    public helloWorld: string;

    @Input('mhrHelloWorld')
    public hello2World: IAction;

    @Input()
    public hello3World: Array<string>;

    @Output()
    public onClick: EventEmitter<void> = new EventEmitter();

    @Output('mhrOnClick')
    public onDoubleClick: EventEmitter<boolean> = new EventEmitter();

    public action: IAction;
    public actions: Array<IAction>;

    constructor(actionFetcherService: ActionFetcherService) {
        this.action = actionFetcherService.defaultAction;
        this.actions = actionFetcherService.getActions('hello');
    }
}
