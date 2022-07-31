import fs from 'fs';
import { parse } from 'csv-parse/sync';
import iconv from 'iconv-lite';
import jschardet from 'jschardet';

import JoinToArray from './JoinToArray';

const main = () => {
    let ERROR;
    try {
        let errorMessage = '';
        ERROR = 'E00001';
        const inputPaths: string[] = process.argv.slice(2);
        // 入力されているファイルパスが2つあるか確認する
        if (inputPaths.length !== 3) {
            errorMessage = 'CSVファイルのパスを3つ入力してください';
        }
        if (errorMessage !== '') {
            console.error(errorMessage);
            return;
        }

        ERROR = 'E00002';
        const pathA = inputPaths[0]; //inputファイルパス1
        const pathB = inputPaths[1]; //inputファイルパス2
        const pathC = inputPaths[2]; //outputファイルパス

        ERROR = 'E00003';
        // 第一ファイルチェック
        errorMessage = inputFileChack(pathA);
        if (errorMessage !== '') {
            console.error(errorMessage);
            return;
        }

        ERROR = 'E00004';
        // 第二ファイルチェック
        errorMessage = inputFileChack(pathB);
        if (errorMessage !== '') {
            console.error(errorMessage);
            return;
        }

        // CSVを配列に変換する
        ERROR = 'E00005';
        const arrayA: string[][] = convertToArray(pathA);
        ERROR = 'E00006';
        const arrayB: string[][] = convertToArray(pathB);

        // 二つの配列をIDを元に結合する
        ERROR = 'E00007';
        const joinToArray = new JoinToArray(arrayA, arrayB);

        const result = joinToArray.innerJoin(0, 0);

        // 配列を出力文字化
        ERROR = 'E00008';
        const outputText = result.map((row) => row.join(',')).join('\n');
        fs.writeFile(pathC, iconv.encode(outputText, 'Shift_JIS'), (error) => {
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
 *ファイルパスのチェックを行う
 * @param inputPath
 */
const inputFileChack = (inputPath: string): string => {
    // ファイルパスの存在チェック
    if (!fs.existsSync(inputPath)) {
        return 'ファイルパスが存在しません';
    }

    // ファイル種類チェック
    const reg = / *.csv$/;
    if (!reg.test(inputPath)) {
        return 'CSVファイルではないファイルが含まれます';
    }

    // ファイルサイズチェック
    const state = fs.statSync(inputPath);
    if (state.size === 0) {
        return '0バイトのファイルは処理できません';
    }

    return '';
};

/**
 *ファイルパスを受取、CSVを変換し配列にして返却する
 * @param path
 * @returns
 */
const convertToArray = (path: string): string[][] => {
    // Bufferにてファイル内テキストを取得
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
