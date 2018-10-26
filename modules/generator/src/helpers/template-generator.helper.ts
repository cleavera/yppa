export function $templateGenerator(template: string, scope: any): string {
    Object.keys(scope).forEach((property: string) => {
        template = template.replace(new RegExp(`{{${property}}}`, 'g'), scope[property]);
    });

    return template;
}
