export default function Snowflakes() {
    class Snowflake {
        /** @type {number} */
        #radius;
        /** @type {number} */
        #opacity;
        /** @type {number} */
        #posX;
        /** @type {number} */
        #posY;
        /** @type {CanvasRenderingContext2D} */
        #context;

        /**
         * @param {CanvasRenderingContext2D} context
         */
        constructor(context) {
            // this.#posX =
            //     Math.floor(Math.random() * (window.innerWidth - 0)) + 0;
            //     this.#posY = Math.floor(Math.random() * (window.innerWidth - 0)) + 0;

            this.#context = context;
            this.#radius = 50;
            this.#posX = 100;
            this.#posY = 100;
            this.#opacity = 0.5;

            this.#draw();
        }

        #draw() {
            this.#context.beginPath();

            this.#context.arc(
                this.#posX,
                this.#posY,
                this.#radius,
                0,
                Math.PI * 2
            );
            this.#context.fillStyle = "#000";
            this.#context.fill();

            this.#context.closePath();
        }
    }

    (() => {
        const canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        document.body.append(canvas);

        const context = canvas.getContext("2d");

        let y = 100;

        const animation = () => {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);

            y++;

            context.beginPath();

            context.arc(100, y, 50, 0, Math.PI * 2);
            context.fillStyle = "#000";
            context.fill();

            context.closePath();

            requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    })();
}
