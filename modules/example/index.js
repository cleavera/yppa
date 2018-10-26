const parser = require('@yppa/parser');
const generator = require('@yppa/generator');

parser.Project.FromGlob('./src/**/*.component.ts').components.forEach((component) => {
    const scope = generator.$scopeGenerator(component.properties);

    console.log(generator.$templateGenerator(component.template, scope))
});
