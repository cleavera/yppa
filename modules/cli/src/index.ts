#!/usr/bin/env node

import { $orchestratorGenerator } from '@yppa/generator';
import { Component, Project } from '@yppa/parser';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const { src, out }: { src: string, out: string } = require('yargs').argv;

if (!src || !out) {
    throw new Error('Missing required argument "src" or "out"');
}

Project.FromGlob(src).components.forEach((component: Component) => {
    if (!existsSync(out)) {
        mkdirSync(out, {
            recursive: true
        });
    }

    writeFileSync(join(out, component.element.selector + '.ts'), $orchestratorGenerator(component));
});
