import { ClassDeclaration, Project as ProjectAST, SourceFile } from 'ts-simple-ast';
import { ParseError } from '../errors/parse.error';
import { Component } from './component';

export class Project {
    public components: Array<Component>;

    constructor(components: Array<Component>) {
        this.components = components;
    }

    public static FromGlob(glob: string): Project {
        const ast: ProjectAST = new ProjectAST({});

        ast.addExistingSourceFiles(glob);

        const components: Array<Component> = ast.getSourceFiles().reduce((acc: Array<Component>, file: SourceFile) => {
            return acc.concat(file.getClasses().map((item: ClassDeclaration) => {
                try {
                    return Component.FromDeclaration(item);

                } catch (e) {
                    return ParseError.appendLocation(e, `"${file.getFilePath()}"`);
                }
            }));
        }, []);

        return new Project(components);
    }
}
