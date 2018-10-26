export interface IAction {
    link: string;
    name: string;
    action(): void;
}
