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

Project.FromGlob(src).components.forEach((component: Component) => {
    if (!existsSync(out)) {
        mkdirSync(out, {
            recursive: true
        });
    }

    writeFileSync(join(out, 'doc.ts'), $documentationGenerator(component));
    writeFileSync(join(out, 'index.html'), $indexGenerator());
});
