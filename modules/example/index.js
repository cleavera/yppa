const parser = require('@yppa/parser');
const generator = require('@yppa/generator');

parser.Project.FromGlob('./src/**/*.component.ts').components.forEach((component) => {
    console.log(generator.$scopeGenerator(component.properties));
});
