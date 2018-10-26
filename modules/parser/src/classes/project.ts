import { ClassDeclaration, Project as ProjectAST, SourceFile } from 'ts-simple-ast';
import { Component } from './component';

export class Project {
    public static FromGlob(glob: string): Project {
        const ast: ProjectAST = new ProjectAST({});

        ast.addExistingSourceFiles(glob);

        ast.getSourceFiles().forEach((file: SourceFile) => {
            file.getClasses().forEach((item: ClassDeclaration) => {
                console.log(Component.FromDeclaration(item));
            });
        });

        return new Project();
    }
}
