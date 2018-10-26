import { Component } from '@angular/core';
import { IAction } from '../interfaces/action.interface';

@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    public helloWorld: string;

    public action: IAction;
}
