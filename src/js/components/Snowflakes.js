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
                    this.positionX + CIRCLE_RADIUS / 2,
                    this.positionY + CIRCLE_RADIUS / 2,
                    CIRCLE_RADIUS / 2,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = "#000";
                context.fill();
                context.closePath();
            }

            update() {
                if (
                    this.positionY + this.speedY + CIRCLE_RADIUS / 2 >
                    canvas.height
                ) {
                    this.draw();

                    return;
                }

                flakes.forEach((flake) => {
                    if (flake.id === this.id) {
                        return;
                    }
                });

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

        const CIRCLE_RADIUS = 10;

        /** @type {Flake[]} */
        const flakes = [];

        function setup() {
            flakes.push(new Flake(0, 0));

            requestAnimationFrame(draw);
        }

        let lastFrameInMs = 0;

        function draw(currentFrameInMs) {
            // each 2 seconds call the createNewObject() function
            if (!lastFrameInMs || currentFrameInMs - lastFrameInMs >= 1 * 500) {
                lastFrameInMs = currentFrameInMs;

                const randomX = getRandomArbitrary(0, canvas.width);

                flakes.push(new Flake(randomX, 0));
            }

            window.flakes = flakes;

            context.clearRect(0, 0, window.innerWidth, window.innerHeight);

            flakes.forEach((flake) => {
                flake.update();
            });

            requestAnimationFrame(draw);
        }

        requestAnimationFrame(setup);
    })();
}
