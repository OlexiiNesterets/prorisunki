'use strict';

(function() {
    const switchBetween = (selector1, selector2) => {
        document.querySelector(selector1).classList.toggle('hidden');
        document.querySelector(selector2).classList.toggle('hidden');
    };

    const handleClick = () => {
        const date = new Date();

        document.querySelector('.hours').textContent = date.getHours();
        document.querySelector('.minutes').textContent = date.getMinutes();
        document.querySelector('.seconds').textContent = `${date.getSeconds()}.${date.getMilliseconds()}`;

        switchBetween('.show-time-btn', '.time-info');
    }

    document.querySelector('.show-time-btn').addEventListener('touchstart', handleClick);
    document.querySelector('.show-time-btn').addEventListener('mousedown', handleClick);
})();