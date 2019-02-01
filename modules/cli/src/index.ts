#!/usr/bin/env node

import { $documentationGenerator, $indexGenerator } from '@yppa/generator';
import { Component, Project } from '@yppa/parser';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const { src, out, depth }: { src: string, out: string, depth: number } = require('yargs')
    .usage('Usage $0 --src="[source-glob]" --out="[out-dir] --depth=[number=10]')
    .demandOption(['src', 'out'])
    .option('depth', {
        default: 10,
        description: 'The max search depth'
    })
    .argv;

process.env.max_depth = depth.toString(10);

if (!existsSync(out)) {
    mkdirSync(out, {
        recursive: true
    });
}

Project.FromGlob(src).components.forEach((component: Component) => {
    const componentOut: string = join(out, component.element.selector);

    if (!existsSync(componentOut)) {
        mkdirSync(componentOut, {
            recursive: true
        });
    }

    writeFileSync(join(componentOut, 'index.ts'), $documentationGenerator(component));
    writeFileSync(join(componentOut, 'index.html'), $indexGenerator());
});
