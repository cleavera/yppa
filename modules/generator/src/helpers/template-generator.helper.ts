export function $templateGenerator(template: string, scope: any): string {
    Object.keys(scope).forEach((property: string) => {
        template = template.replace(new RegExp(`{{${property}}}`, 'g'), scope[property]);
    });

    template.replace(/<ng-content(\s.+?>)?<\/ng-content>/g, `<p>Hello world, this is the example markup.</p>`);

    return template;
}
