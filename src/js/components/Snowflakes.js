export default function Snowflakes() {
    (() => {
        const canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        document.body.append(canvas);

        const context = canvas.getContext("2d");

        function getRandomArbitrary(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        /**
         * @typedef Grid
         * @type {Grid}
         */

        const CELL_WIDTH = 10;

        /** @type {Grid} */
        let currentGrid,
            /** @type {number} */
            cols,
            /** @type {number} */
            rows;

        /**
         * @param {number} cols
         * @param {number} rows
         */
        function makeGrid(cols, rows) {
            /** @type {Grid} */
            let array = new Array(cols);

            for (let i = 0; i < array.length; i++) {
                array[i] = new Array(rows);

                for (let j = 0; j < array[i].length; j++) {
                    array[i][j] = 0;
                }
            }

            return array;
        }

        /**
         * For test only
         */
        function drawCells() {
            for (let i = 0; i < currentGrid.length; i++) {
                for (let j = 0; j < currentGrid[i].length; j++) {
                    context.beginPath();

                    context.strokeStyle = "rgba(255, 255, 255, 0.1)";
                    context.strokeRect(
                        CELL_WIDTH * i,
                        CELL_WIDTH * j,
                        CELL_WIDTH,
                        CELL_WIDTH
                    );

                    context.closePath();
                }
            }
        }

        function drawFlakes() {
            for (let i = 0; i < currentGrid.length; i++) {
                for (let j = 0; j < currentGrid[i].length; j++) {
                    const cell = currentGrid[i][j];

                    if (cell !== 1) {
                        continue;
                    }

                    const leftTopCell = currentGrid[i - 1]?.[j - 1];
                    const topCell = currentGrid[i][j - 1];
                    const rightTopCell = currentGrid[i + 1]?.[j - 1];
                    const rightCell = currentGrid[i + 1]?.[j];
                    const rightBottomCell = currentGrid[i + 1]?.[j + 1];
                    const bottomCell = currentGrid[i][j + 1];
                    const leftBottomCell = currentGrid[i - 1]?.[j + 1];
                    const leftCell = currentGrid[i - 1]?.[j];

                    const hasFlakeLeftTop =
                        leftTopCell === 1 || leftTopCell === undefined;

                    const hasFlakeTop = topCell === 1 || topCell === undefined;

                    const hasFlakeRightTop =
                        rightTopCell === 1 || rightTopCell === undefined;

                    const hasFlakeRight =
                        rightCell === 1 || rightCell === undefined;

                    const hasFlakeLeftBottom =
                        leftBottomCell === 1 || leftBottomCell === undefined;

                    const hasFlakeBottom =
                        bottomCell === 1 || bottomCell === undefined;

                    const hasFlakeRightBottom =
                        rightBottomCell === 1 || rightBottomCell === undefined;

                    const hasFlakeLeft =
                        leftCell === 1 || leftCell === undefined;

                    const hasFlakesFromEverySide =
                        hasFlakeTop &&
                        hasFlakeRight &&
                        hasFlakeBottom &&
                        hasFlakeLeft;

                    if (hasFlakesFromEverySide) {
                        context.fillStyle = "#fff";
                        context.fillRect(
                            CELL_WIDTH * i,
                            CELL_WIDTH * j,
                            CELL_WIDTH,
                            CELL_WIDTH
                        );

                        continue;
                    }

                    const isRoundedLeftTop = !!(
                        !hasFlakeTop &&
                        !hasFlakeLeftTop &&
                        !hasFlakeLeft
                    );
                    const isRoundedRightTop = !!(
                        !hasFlakeTop &&
                        !hasFlakeRightTop &&
                        !hasFlakeRight
                    );
                    const isRoundedRightBottom = !!(
                        !hasFlakeBottom && !hasFlakeRightBottom
                    );
                    const isRoundedLeftBottom = !!(
                        !hasFlakeBottom && !hasFlakeLeftBottom
                    );

                    context.beginPath();
                    context.roundRect(
                        CELL_WIDTH * i,
                        CELL_WIDTH * j,
                        CELL_WIDTH,
                        CELL_WIDTH,
                        [
                            isRoundedLeftTop ? 9999 : 0,
                            isRoundedRightTop ? 9999 : 0,
                            isRoundedRightBottom ? 9999 : 0,
                            isRoundedLeftBottom ? 9999 : 0,
                        ]
                    );
                    context.fillStyle = "#fff";
                    context.fill();
                    context.closePath();
                }
            }
        }

        function setup() {
            cols = Math.ceil(canvas.width / CELL_WIDTH);
            rows = Math.ceil(canvas.height / CELL_WIDTH);

            currentGrid = makeGrid(cols, rows);

            drawCells();

            const randomX = getRandomArbitrary(0, cols);

            currentGrid[randomX][0] = 1;

            drawFlakes();

            requestAnimationFrame(draw);
        }

        let lastFrameInMs = 0;

        function draw(currentFrameInMs) {
            // each 2 seconds call the createNewObject() function
            if (!lastFrameInMs || currentFrameInMs - lastFrameInMs >= 1 * 100) {
                lastFrameInMs = currentFrameInMs;

                const randomX = getRandomArbitrary(1, cols - 1);

                currentGrid[randomX][0] = 1;
            }

            context.clearRect(0, 0, window.innerWidth, window.innerHeight);

            const newGrid = makeGrid(cols, rows);

            for (let i = 0; i < currentGrid.length; i++) {
                for (let j = 0; j < currentGrid[i].length; j++) {
                    const cell = currentGrid[i][j];
                    const leftBottomCell = currentGrid[i - 1]?.[j + 1];
                    const bottomCell = currentGrid[i][j + 1];
                    const rightBottomCell = currentGrid[i + 1]?.[j + 1];

                    if (cell === 0) {
                        continue;
                    }

                    if (bottomCell === 0) {
                        newGrid[i][j + 1] = 1;

                        continue;
                    }

                    if (leftBottomCell === 0 && rightBottomCell === 0) {
                        if (Math.random() > 0.5) {
                            newGrid[i - 1][j + 1] = 1;

                            continue;
                        }

                        newGrid[i + 1][j + 1] = 1;

                        continue;
                    }

                    if (leftBottomCell === 0) {
                        newGrid[i - 1][j + 1] = 1;

                        continue;
                    }

                    if (rightBottomCell === 0) {
                        newGrid[i + 1][j + 1] = 1;

                        continue;
                    }

                    newGrid[i][j] = 1;
                }
            }

            currentGrid = newGrid;

            // drawCells();
            drawFlakes();

            requestAnimationFrame(draw);
        }

        requestAnimationFrame(setup);
    })();
}
