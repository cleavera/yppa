#!/usr/bin/env node

import { $documentationGenerator } from '@yppa/generator';
import { Component, Project } from '@yppa/parser';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const { src, out }: { src: string, out: string } = require('yargs')
    .usage('Usage $0 --src="[source-glob]" --out="[out-dir]"')
    .demandOption(['src', 'out'])
    .argv;

Project.FromGlob(src).components.forEach((component: Component) => {
    if (!existsSync(out)) {
        mkdirSync(out, {
            recursive: true
        });
    }

    writeFileSync(join(out, component.element.selector + '.ts'), $documentationGenerator(component));
});
