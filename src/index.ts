import fs from 'fs';
import { parse } from 'csv-parse/sync';
import iconv from 'iconv-lite';
import jschardet from 'jschardet';

import JoinToArray from './JoinToArray';
import InputParams from './InputParams';

const main = () => {
    let ERROR;
    try {
        let errorMessage = '';
        ERROR = 'E00001';
        const inputParams = new InputParams(process.argv.slice(2));

        errorMessage = inputParams.getErrorMassege();
        if (errorMessage !== '') {
            console.error(errorMessage);
            return;
        }

        // CSVを配列に変換する
        ERROR = 'E00002';
        const arrayA: string[][] = convertToArray(inputParams.getInputFilePathA());
        ERROR = 'E00003';
        const arrayB: string[][] = convertToArray(inputParams.getInputFilePathB());

        // 二つの配列をIDを元に結合する
        ERROR = 'E00004';
        const joinToArray = new JoinToArray(arrayA, arrayB);

        ERROR = 'E00005';
        const result = joinToArray.innerJoin(inputParams.getKeyIndexA(), inputParams.getKeyIndexB());

        // 配列を出力文字化
        ERROR = 'E00006';
        const outputText = result.map((row) => row.join(',')).join('\n');
        fs.writeFile(inputParams.getOutputFilePath(), iconv.encode(outputText, 'Shift_JIS'), (error) => {
            if (error) {
                throw error;
            }
            console.log('CSVファイルを作成しました');
        });
    } catch (e) {
        console.error('エラーコード:', ERROR);
        console.error(e);
    }
};

/**
 *ファイルパスを受取、CSVを変換し配列にして返却する
 * @param path
 * @returns
 */
const convertToArray = (path: string): string[][] => {
    // Bufferにてファイル内テキストを取得8
    const text = fs.readFileSync(path);
    // テキストから文字コードを取得
    const detect = jschardet.detect(text);
    // iconvにてテキストを変換
    const convertText = iconv.decode(text, detect.encoding);
    // カンマ区切りで配列に変換
    const array: string[][] = parse(convertText);

    // 先頭配列を削除
    array.shift();

    return array;
};

(() => main())();
console.log('実行終了');
