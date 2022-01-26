'use strict';

(function () {

    const makeId = (length, acc = '') => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const getRandomNumberFrom = (length) => () => Math.floor(Math.random() * length);
        const getRandomFromCharsLength = getRandomNumberFrom(characters.length);
        const id = acc + characters.charAt(getRandomFromCharsLength());
        return (id.length === length) ? id : makeId(length, id);
    }

    const id = makeId(64);

    const socket = new WebSocket(`wss://damp-basin-24026.herokuapp.com/`);
    // const socket = new WebSocket(`ws://localhost:5000/`);




    const switchBetween = (selector1, selector2) => {
        document.querySelector(selector1).classList.toggle('hidden');
        document.querySelector(selector2).classList.toggle('hidden');
    };

    const pipe = (val) => (...fns) => fns.reduce((acc, fn) => fn(acc), val);
    const callMethod = (methodName) => (val) => val[methodName]();
    const addLeadingZero = (val) => val.length < 2 ? `0${val}` : val;
    const addTrailingZero = (val) => val.length < 3 ? addTrailingZero(`${val}0`) : val;

    const getTimeRowHtml = (date) => {
        const datePipe = pipe(date);
        const hours = datePipe(callMethod('getHours'), callMethod('toString'), addLeadingZero);
        const minutes = datePipe(callMethod('getMinutes'), callMethod('toString'), addLeadingZero);
        const seconds = datePipe(callMethod('getSeconds'), callMethod('toString'), addLeadingZero);
        const milliseconds = datePipe(callMethod('getMilliseconds'), callMethod('toString'), addTrailingZero);
        return `
            <span class="time">
                ${hours}<span class="colon">:</span>${minutes}<span class="colon">:</span>${seconds}<span class="dot">.</span>${milliseconds}
            </span>
        `;
    }

    const handleClick = () => {

        const time = new Date();

        socket.addEventListener('message', function (event) {

            let dataArr = JSON.parse(event.data);

            const list = dataArr.reduce((acc, elem, i) => {
                const div = document.createElement('div');
                div.classList.add('time-row');
                div.innerHTML = `<span class="number-sign">№</span><span>${i + 1}</span> <span class="delimiter"></span> ${getTimeRowHtml(new Date(elem.time))}`;
                if (elem.id === id) {
                    div.classList.add('highlighted');
                }
                acc.push(div);
                return acc;
            }, []);

            document.querySelector('.list').innerHTML = '';
            document.querySelector('.list').append(...list);
        });

        socket.send(JSON.stringify({ id, time }));

        switchBetween('.show-time-btn', '.time-info');
    }

    document.querySelector('.show-time-btn').addEventListener('touchstart', handleClick);
    document.querySelector('.show-time-btn').addEventListener('mousedown', handleClick);
})();