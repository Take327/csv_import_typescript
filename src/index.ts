import fs from 'fs';

const main = () => {
    try {
        const inputPaths: string[] = process.argv.slice(2);
        // 入力されているファイルパスが2つあるか確認する
        if (inputPaths.length !== 2) {
            throw new Error('CSVファイルのパスを2つ入力してください');
        }

        const pathA = inputPaths[0];
        const pathB = inputPaths[1];

        // 第一ファイルチェック
        let error = '';
        error = inputPathChack(pathA);
        if (error !== '') {
            throw new Error(error);
        }

        // 第二ファイルチェック
        error = inputPathChack(pathB);
        if (error !== '') {
            throw new Error(error);
        }

        // ファイルを読み込む 文字コードを指定するとStringで返却される
        const textA = fs.readFileSync(pathA, 'utf-8');
        const textB = fs.readFileSync(pathB, 'utf-8');

        console.log('textA', textA);
        console.log('textB', textB);
    } catch (e) {
        console.log(e);
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

(() => main())();
