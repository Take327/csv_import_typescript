import fs from 'fs';
import { parse } from 'csv-parse/sync';
import iconv from 'iconv-lite';
import jschardet from 'jschardet';

const main = () => {
    let ERROR;
    try {
        ERROR = 'E00001';
        const inputPaths: string[] = process.argv.slice(2);
        // 入力されているファイルパスが2つあるか確認する
        if (inputPaths.length !== 2) {
            throw new Error('CSVファイルのパスを2つ入力してください');
        }

        ERROR = 'E00002';
        const pathA = inputPaths[0];
        const pathB = inputPaths[1];

        ERROR = 'E00003';
        // 第一ファイルチェック
        let errorMessage = '';
        errorMessage = inputPathChack(pathA);
        if (errorMessage !== '') {
            console.log(errorMessage);
            return;
        }

        ERROR = 'E00004';
        // 第二ファイルチェック
        errorMessage = inputPathChack(pathB);
        if (errorMessage !== '') {
            console.log(errorMessage);
            return;
        }

        ERROR = 'E00005';
        // CSVを配列に変換する
        const arrayA: [] = convertToArray(pathA);

        ERROR = 'E00006';
        const arrayB: [] = convertToArray(pathB);

        console.log('textA', arrayA);
        console.log('textB', arrayB);
    } catch (e) {
        console.error('エラーコード:', ERROR);
        console.error(e);
    }
};

/**
 *ファイルパスのチェックを行う
 * @param inputPath
 */
const inputPathChack = (inputPath: string): string => {
    try {
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
    } catch (e) {
        console.error('inputPathsChackでエラーが発生しました', e);
    }
};

/**
 *ファイルパスを受取、CSVを変換し配列にして返却する
 * @param path
 * @returns
 */
const convertToArray = (path: string): [] => {
    try {
        // Bufferにてファイル内テキストを取得
        const text = fs.readFileSync(path);
        // テキストから文字コードを取得
        const detect = jschardet.detect(text);
        // iconvにてテキストを変換
        const convertText = iconv.decode(text, detect.encoding);
        // カンマ区切りで配列に変換
        const array: [] = parse(convertText);

        return array;
    } catch (e) {
        console.error('convertToArrayでエラーが発生しました', e);
    }
};

(() => main())();
