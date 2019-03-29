export class SweeperData
{
    private _row: number;           // 行数
    private _col: number;           // 列数
    private _mineNums: number;      // 地雷数

    private _map: boolean[][];      // 地雷分布
    private _flag: boolean[][];     // 旗帜分布
    private _nums: number[][];      // 周边地雷分布情况
    private _open: boolean[][];     // 打开情况

    constructor ( row: number, col: number, mineNums: number )
    {
        this._row = row;
        this._col = col;
        this._mineNums = mineNums;

        this._map = [];
        this._flag = [];
        this._open = [];
        this._nums = [];
        for ( let row = 0; row < this._row; row++ ) {
            this._map[ row ] = [];
            this._flag[ row ] = [];
            this._open[ row ] = [];
            this._nums[ row ] = [];
            for ( let col = 0; col < this._col; col++ ) {
                this._map[ row ][ col ] = false;
                this._flag[ row ][ col ] = false;
                this._open[ row ][ col ] = false;
                this._nums[ row ][ col ] = 0;
            }
        }

        this._initMines();
        this._initNums();
    }

    get ROW () { return this._row; }
    get COL () { return this._col; }
    get MINE_NUMS () { return this._mineNums; }

    // 初始化雷区分布
    private _initMines (): void
    {
        // 把雷都放在地图的开始位置
        let row = 0;
        let col = 0;
        for ( let i = 0; i < this._mineNums; i++ ) {
            row = Math.floor( i / this._col );
            col = Math.floor( i % this._col );
            this._map[ row ][ col ] = true;
        }

        // 使用knuth-shuffle 进行洗牌
        let len = this._col * this._row;
        let randomIndex = 0;
        let temp = null;
        let ir = 0, ic = 0;
        let rr = 0, rc = 0;
        for ( let i = len - 1; i >= 0; i-- ) {
            // 抽取一个位置出来
            randomIndex = Math.floor( Math.random() * i );
            // 与i位置上的元素进行交换
            rr = Math.floor( randomIndex / this._col );
            rc = Math.floor( randomIndex % this._col );
            ir = Math.floor( i / this._col )
            ic = Math.floor( i % this._col )

            temp = this._map[ rr ][ rc ];
            this._map[ rr ][ rc ] = this._map[ ir ][ ic ];
            this._map[ ir ][ ic ] = temp;
        }
    }

    // 根据雷区分布进行提示区域初始化
    private _initNums (): void
    {
        for ( let row = 0; row < this._row; row++ ) {
            for ( let col = 0; col < this._col; col++ ) {

                // 移除本身是雷
                if ( this.isMine( row, col ) )
                    this._nums[ row ][ col ] = -1;

                for ( let rr = row - 1; rr <= row + 1; rr++ ) {
                    for ( let cc = col - 1; cc <= col + 1; cc++ ) {
                        if ( !this.checkArea( rr, cc ) ) continue;
                        if ( this.isMine( rr, cc ) )
                            this._nums[ row ][ col ]++;
                    }
                }
            }
        }
    }

    // 区域溢出检查
    checkArea ( row: number, col: number ): boolean
    {
        if ( row < 0 || row >= this._row || col < 0 || col >= this._col )
            return false;
        return true;
    }

    // 判断是否是雷
    isMine ( row: number, col: number ): boolean { return this.checkArea( row, col ) && this._map[ row ][ col ]; }

    // 立flag
    setFlag ( row: number, col: number ): void
    {
        if ( !this.checkArea( row, col ) ) return;
        if ( this._open[ row ][ col ] ) return;

        this._flag[ row ][ col ] = !this._flag[ row ][ col ];
    }
    // 是否立flag
    isFlag ( row: number, col: number ): boolean { return this.checkArea( row, col ) && this._flag[ row ][ col ]; }

    // 是否开啊
    isOpen ( row: number, col: number ): boolean { return this.checkArea( row, col ) && this._open[ row ][ col ]; }
    // 打开某个格子
    open ( row: number, col: number ): void
    {
        // 越界不能打开
        if ( !this.checkArea( row, col ) ) return;
        // 有旗帜不能打开
        if ( this._flag[ row ][ col ] ) return;

        this._open[ row ][ col ] = true;
    }

    // 获取具体区域的炸弹数
    getNums ( row: number, col: number ): number { return this._nums[ row ][ col ]; }
}
