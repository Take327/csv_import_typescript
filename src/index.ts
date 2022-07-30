import fs from 'fs';
import { parse } from 'csv-parse/sync';
import iconv from 'iconv-lite';
import jschardet from 'jschardet';

const main = () => {
    let ERROR;
    try {
        let errorMessage = '';
        ERROR = 'E00001';
        const inputPaths: string[] = process.argv.slice(2);
        // 入力されているファイルパスが2つあるか確認する
        if (inputPaths.length !== 2) {
            errorMessage = 'CSVファイルのパスを2つ入力してください';
        }
        if (errorMessage !== '') {
            console.error(errorMessage);
            return;
        }

        ERROR = 'E00002';
        const pathA = inputPaths[0];
        const pathB = inputPaths[1];

        ERROR = 'E00003';
        // 第一ファイルチェック
        errorMessage = inputPathChack(pathA);
        if (errorMessage !== '') {
            console.error(errorMessage);
            return;
        }

        ERROR = 'E00004';
        // 第二ファイルチェック
        errorMessage = inputPathChack(pathB);
        if (errorMessage !== '') {
            console.error(errorMessage);
            return;
        }

        // CSVを配列に変換する
        ERROR = 'E00005';
        const arrayA: string[][] = convertToArray(pathA);
        ERROR = 'E00006';
        const arrayB: string[][] = convertToArray(pathB);

        //二つの配列をIDを元に結合する
        ERROR = 'E00007';
        const result = joinToArray(arrayA, 0, arrayB, 0);

        console.log('result', result);
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

/**
 * arrayAのidIndexAを元にarrayBをInner Joinにて結合する
 * @param arrayA
 * @param idIndexA
 * @param arrayB
 * @param idIndexB
 * @returns
 */
const joinToArray = (arrayA: string[][], idIndexA: number, arrayB: string[][], idIndexB: number): string[][] => {
    const map = arrayA.map((leftRow) => {
        //idが一致するrowをサーチする
        const rightRow = arrayB.find((row) => {
            return leftRow[idIndexA] === row[idIndexB];
        });

        //該当するrightRowがない場合はleftRowだけで返却
        const row = leftRow;
        if (!rightRow) {
            return row;
        }

        //leftRowの後ろにrightRowを追加する
        for (let i = 0; i < rightRow.length; i++) {
            if (i > idIndexB) {
                row.push(rightRow[i]);
            }
        }

        return row;
    });

    return map;
};

(() => main())();
