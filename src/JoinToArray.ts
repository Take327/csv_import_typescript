export default class JoinToArray {
    private arrayA: string[][];
    private arrayB: string[][];
    private maxLengthA: number; // arrayAの最大要素数
    private maxLengthB: number; // arrayBの最大要素数

    constructor(arrayA: string[][], arrayB: string[][]) {
        // maxLengthAを更新
        this.maxLengthA = this.maxLengthCheck(arrayA);

        // maxLengthBを更新
        this.maxLengthB = this.maxLengthCheck(arrayB);

        // 最大要素数で合わせたarrayA
        this.arrayA = this.arrayFitToMaximum(arrayA, this.maxLengthA);

        // 最大要素数で合わせたarrayB
        this.arrayB = this.arrayFitToMaximum(arrayB, this.maxLengthB);
    }

    /**
     * 最大要素数で合わせる
     * @param array
     * @param maxLength
     * @returns
     */
    private arrayFitToMaximum = (array: string[][], maxLength: number): string[][] => {
        const result = array.map((row) => {
            if (row.length < maxLength) {
                for (let i = row.length; i < maxLength; i++) {
                    row.push('');
                }

                return row;
            } else {
                return row;
            }
        });

        return result;
    };

    /**
     * 配列内の最大要素数を取得する
     * @param array
     * @returns
     */
    private maxLengthCheck = (array: string[][]): number => {
        let maxLength = 0;

        array.forEach((row) => {
            if (maxLength < row.length) {
                maxLength = row.length;
            }
        });

        return maxLength;
    };

    public innerJoin = (idIndexA: number, idIndexB: number): string[][] => {
        const map = this.arrayA.map((leftRow) => {
            // idが一致するrowをサーチする
            const rightRow = this.arrayB.find((row) => {
                return leftRow[idIndexA] === row[idIndexB];
            });
            // rightRowがない場合は配列を初期化する
            if (!rightRow) {
                return [];
            }

            // 戻り値
            const row = Array.from(leftRow);

            // leftRowの後ろにrightRowを追加する
            for (let i = 0; i < rightRow.length; i++) {
                if (i > idIndexB) {
                    row.push(rightRow[i]);
                }
            }

            return row;
        });

        return map.filter((row) => row.length !== 0);
    };
}
