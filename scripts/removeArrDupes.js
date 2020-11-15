#!/usr/bin/env node
'use strict';

const fs = require('fs').promises;
const readline = require('readline');
const path = require('path');

const { program } = require('commander');
const logger = require('@fizzygalacticus/colored-fancy-log');

const pkg = require('../package.json');

program.version(pkg.version);
program
    .requiredOption('-f, --file <file>', 'The JSON array file to process')
    .option('-a, --auto', 'Enable auto-processing. Will prompt for removals if disabled', false);

program.parse(process.argv);

const prompt = question =>
    new Promise(res => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        rl.question(question, ans => {
            rl.close();

            res(ans);
        });
    });

const normalize = str =>
    str
        .replace(/[^A-Za-z0-9]/gim, ' ')
        .split(' ')
        .filter(s => s)
        .join('-')
        .toLowerCase();

const groupByNormalized = arr => {
    const obj = {};

    arr.forEach(v => {
        const norm = normalize(v);

        if (!obj[norm]) {
            obj[norm] = [];
        }

        obj[norm].push(v);
    });

    return obj;
};

const createNumArr = length => {
    const ret = [];

    for (let i = 1; i <= length; i++) {
        ret.push(i + '');
    }

    return ret;
};

const main = async () => {
    const { file, auto } = program;

    const filepath = [process.cwd(), file].join(path.sep);

    const arr = require(filepath);

    const grouped = groupByNormalized(arr);

    for (const group of Object.values(grouped)) {
        if (group.length > 1) {
            const nums = createNumArr(group.length);

            const options = group.map((v, idx) => `${nums[idx]}. ${v}`).join('\n');

            let input = '1';

            if (!auto) {
                do {
                    input = await prompt(`Which would you like to keep?\n${options}\n`);

                    if (!nums.includes(input)) {
                        logger.error('Must select a valid option');
                    }
                } while (!nums.includes(input));
            }

            const selectedIdx = parseInt(input, 10) - 1;

            group.splice(0, selectedIdx);
            group.splice(selectedIdx + 1, group.length);
        }
    }

    const input = await prompt('Write? [Y/N] ');

    if (input.toLowerCase() === 'y') {
        await fs.writeFile(filepath, JSON.stringify(Object.values(grouped).flat()));
    }

    process.exit(0);
};

main().catch(err => {
    logger.error(err);
    process.exit(1);
});
