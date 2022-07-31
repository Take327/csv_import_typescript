import fs from 'fs';

export default class InputParams {
    private inputFilePathA: string = '';
    private inputFilePathB: string = '';
    private outputFilePath: string = '';
    private keyIndexA: number = 0;
    private keyIndexB: number = 0;
    private joinType: number = 0;

    private outputFlg: number = 0; // 0:ファイル名生成不要 1:ファイル名生成用

    private errorMassege: string = '';

    constructor(inputParams: string[]) {
        this.checkInputParams(inputParams);

        if (this.errorMassege !== '') {
            return;
        }

        // エラーがない場合はパラメータをセットする
        this.inputFilePathA = inputParams[0];
        this.inputFilePathB = inputParams[1];
        this.outputFilePath = inputParams[2];

        // ファイル名生成が必要な場合
        if (this.outputFlg === 1) {
            this.outputFilePath = this.outputFilePath + '/output.csv';
        }

        if (inputParams.length >= 4) {
            this.keyIndexA = parseInt(inputParams[3]);
        }

        if (inputParams.length >= 5) {
            this.keyIndexB = parseInt(inputParams[4]);
        }

        if (inputParams.length >= 6) {
            this.joinType = parseInt(inputParams[5]);
        }
    }

    private checkInputParams = (inputParams: string[]) => {
        if (inputParams.length < 3) {
            this.errorMassege = '引数が足りません';
            return;
        }

        let errorMassege = '';
        // CSVファイルチェック1
        errorMassege = this.csvFileChack(inputParams[0]);
        if (errorMassege !== '') {
            this.errorMassege = errorMassege;
            return;
        }

        // CSVファイルチェック2
        errorMassege = this.csvFileChack(inputParams[1]);
        if (errorMassege !== '') {
            this.errorMassege = errorMassege;
            return;
        }

        // 出力ファイルパスチェック
        fs.stat(inputParams[2], (err, stat) => {
            if (err) {
                console.log('true');
                errorMassege = '出力先が確認できません';
            } else {
                console.log('else');
                stat.isFile()
                    ? (this.outputFlg = 0)
                    : stat.isDirectory()
                    ? (this.outputFlg = 1)
                    : (errorMassege = '出力先が確認できません');
            }
        });
        if (errorMassege !== '') {
            this.errorMassege = errorMassege;
            return;
        }

        // 第4引数以降が数値変換が可能かチェックする
        for (let i = 3; i < inputParams.length; i++) {
            if (isNaN(parseInt(inputParams[i]))) {
                errorMassege = i + 1 + '目の引数が数字ではありません';
                // ループ終了
                i = inputParams.length;
            }
        }

        if (errorMassege !== '') {
            this.errorMassege = errorMassege;
        }
    };

    private csvFileChack = (inputPath: string): string => {
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
     * エラーメッセージを取得する
     * @returns
     */
    public getErrorMassege = (): string => {
        return this.errorMassege;
    };

    /**
     * ファイルパスAを取得する
     * @returns
     */
    public getInputFilePathA = (): string => {
        return this.inputFilePathA;
    };

    /**
     * ファイルパスBを取得する
     * @returns
     */
    public getInputFilePathB = (): string => {
        return this.inputFilePathB;
    };

    /**
     * 出力ファイルパスを取得する
     * @returns
     */
    public getOutputFilePath = (): string => {
        return this.outputFilePath;
    };

    /**
     * ファイルAのキーINDEXを取得する
     * @returns
     */
    public getKeyIndexA = (): number => {
        return this.keyIndexA;
    };

    /**
     * ファイルAのキーINDEXを取得する
     * @returns
     */
    public getKeyIndexB = (): number => {
        return this.keyIndexB;
    };

    /**
     * Join typeを取得する
     * @returns
     */
    public getJoinType = (): number => {
        return this.joinType;
    };
}
