#!/usr/bin/env node

import { $scopeGenerator, $templateGenerator } from '@yppa/generator';
import { Component, Project } from '@yppa/parser';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const { src, out }: { src: string, out: string } = require('yargs').argv;

if (!src || !out) {
    throw new Error('Missing required argument "src" or "out"');
}

Project.FromGlob(src).components.forEach((component: Component) => {
    const scope: any = $scopeGenerator(component.properties);
    const template: string = $templateGenerator(component.template, scope);

    if (!existsSync(out)) {
        mkdirSync(out, {
            recursive: true
        });
    }

    writeFileSync(join(out, component.selector + '.html'), template);
});
