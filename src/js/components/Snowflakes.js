export default function Snowflakes() {
    (() => {
        function makeid(length = 5) {
            let result = "";
            const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                );
                counter += 1;
            }
            return result;
        }

        class Flake {
            /** @type {string} */
            id;
            /** @type {number} */
            positionX;
            /** @type {number} */
            positionY;
            /** @type {number} */
            speedX;
            /** @type {number} */
            speedY;

            /**
             * @param {number} positionX
             * @param {number} positionY
             */
            constructor(positionX, positionY) {
                this.positionX = positionX;
                this.positionY = positionY;

                this.speedY = 10;

                this.id = makeid();

                this.draw();
            }

            draw() {
                context.beginPath();
                context.arc(
                    this.positionX + CELL_WIDTH / 2,
                    this.positionY + CELL_WIDTH / 2,
                    CELL_WIDTH / 2,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = "#000";
                context.fill();
                context.closePath();
            }

            update() {
                if (
                    this.positionY + this.speedY + CELL_WIDTH / 2 >
                    canvas.height
                ) {
                    this.draw();

                    return;
                }

                this.positionY += this.speedY;

                this.draw();
            }
        }

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

                    context.strokeStyle = "rgba(0, 0, 0, 0.3)";
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

                    const hasFlakesFromEverySide =
                        (leftTopCell === 1 || leftTopCell === undefined) &&
                        (topCell === 1 || topCell === undefined) &&
                        (rightTopCell === 1 || rightTopCell === undefined) &&
                        (rightCell === 1 || rightCell === undefined) &&
                        (rightBottomCell === 1 ||
                            rightBottomCell === undefined) &&
                        (bottomCell === 1 || bottomCell === undefined) &&
                        (leftBottomCell === 1 ||
                            leftBottomCell === undefined) &&
                        (leftCell === 1 || leftCell === undefined);

                    if (hasFlakesFromEverySide) {
                        context.fillStyle = "#000";
                        context.fillRect(
                            CELL_WIDTH * i,
                            CELL_WIDTH * j,
                            CELL_WIDTH,
                            CELL_WIDTH
                        );

                        continue;
                    }

                    context.beginPath();
                    context.arc(
                        CELL_WIDTH * i + CELL_WIDTH / 2,
                        CELL_WIDTH * j + CELL_WIDTH / 2,
                        CELL_WIDTH / 2,
                        0,
                        Math.PI * 2
                    );
                    context.fillStyle = "#000";
                    context.fill();
                    context.closePath();
                }
            }
        }

        /** @type {Flake[]} */
        const flakes = [];

        function setup() {
            flakes.push(new Flake(0, 0));

            cols = Math.ceil(canvas.width / CELL_WIDTH);
            rows = Math.ceil(canvas.height / CELL_WIDTH);

            currentGrid = makeGrid(cols, rows);

            drawCells();

            // const randomX = getRandomArbitrary(0, cols);

            // currentGrid[randomX][0] = 1;

            const randomX = getRandomArbitrary(1, cols - 1);

            currentGrid[randomX - 1][0] = 1;
            currentGrid[randomX][0] = 1;
            currentGrid[randomX + 1][0] = 1;
            currentGrid[randomX][1] = 1;

            drawFlakes();

            requestAnimationFrame(draw);
        }

        let lastFrameInMs = 0;

        function draw(currentFrameInMs) {
            // each 2 seconds call the createNewObject() function
            if (!lastFrameInMs || currentFrameInMs - lastFrameInMs >= 1 * 500) {
                lastFrameInMs = currentFrameInMs;

                const randomX = getRandomArbitrary(1, cols - 1);

                currentGrid[randomX - 1][0] = 1;
                currentGrid[randomX][0] = 1;
                currentGrid[randomX + 1][0] = 1;
                currentGrid[randomX][1] = 1;
            }

            context.clearRect(0, 0, window.innerWidth, window.innerHeight);

            flakes.forEach((flake) => {
                flake.update();
            });

            // const newGrid = makeGrid(cols, rows);

            // for (let i = 0; i < currentGrid.length; i++) {
            //     for (let j = 0; j < currentGrid[i].length; j++) {
            //         const cell = currentGrid[i][j];
            //         const bellowCell = currentGrid[i]?.[j + 1];

            //         if (cell === 0) {
            //             continue;
            //         }

            //         if (bellowCell === 0) {
            //             newGrid[i][j + 1] = 1;

            //             continue;
            //         }

            //         newGrid[i][j] = 1;
            //     }
            // }

            // currentGrid = newGrid;

            // drawCells();
            // drawFlakes();

            requestAnimationFrame(draw);
        }

        requestAnimationFrame(setup);
    })();
}
