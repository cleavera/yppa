import { Project as ProjectAST } from 'ts-simple-ast';

export class Project {
    public static FromGlob(glob: string): Project {
        const ast: ProjectAST = new ProjectAST({});

        ast.addExistingSourceFiles(glob);

        return new Project();
    }
}
