'use strict';

const {
    getTimeOfDay,
    getGreeting,
    getVisitCount,
    buildWelcomeMessage,
    initWelcome
} = require('./welcome');

function createStorage(initial) {
    const data = Object.assign({}, initial);
    return {
        getItem: function (key) {
            return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
        },
        setItem: function (key, value) {
            data[key] = String(value);
        }
    };
}

describe('getTimeOfDay', () => {
    test('returns morning from 5 to 11', () => {
        expect(getTimeOfDay(5)).toBe('morning');
        expect(getTimeOfDay(11)).toBe('morning');
    });

    test('returns afternoon from 12 to 16', () => {
        expect(getTimeOfDay(12)).toBe('afternoon');
        expect(getTimeOfDay(16)).toBe('afternoon');
    });

    test('returns evening from 17 to 20', () => {
        expect(getTimeOfDay(17)).toBe('evening');
        expect(getTimeOfDay(20)).toBe('evening');
    });

    test('returns night for late and early hours', () => {
        expect(getTimeOfDay(21)).toBe('night');
        expect(getTimeOfDay(0)).toBe('night');
        expect(getTimeOfDay(4)).toBe('night');
    });
});

describe('getGreeting', () => {
    test('uses the matching themed greeting', () => {
        expect(getGreeting(8)).toContain('Good morrow');
        expect(getGreeting(14)).toContain('Good afternoon');
        expect(getGreeting(19)).toContain('Good evening');
        expect(getGreeting(23)).toContain('night is deep');
    });
});

describe('getVisitCount', () => {
    test('starts at 1 on the first visit and saves it', () => {
        const storage = createStorage({});
        expect(getVisitCount(storage)).toBe(1);
        expect(storage.getItem('ledgerVisits')).toBe('1');
    });

    test('increments an existing count', () => {
        const storage = createStorage({ ledgerVisits: '4' });
        expect(getVisitCount(storage)).toBe(5);
    });

    test('resets to 1 when the stored value is invalid', () => {
        const storage = createStorage({ ledgerVisits: 'banana' });
        expect(getVisitCount(storage)).toBe(1);
    });

    test('returns 1 when storage throws an error', () => {
        const brokenStorage = {
            getItem: function () {
                throw new Error('storage blocked');
            },
            setItem: function () {
                throw new Error('storage blocked');
            }
        };
        expect(getVisitCount(brokenStorage)).toBe(1);
    });
});

describe('buildWelcomeMessage', () => {
    test('mentions a first visit when the count is 1', () => {
        expect(buildWelcomeMessage(8, 1)).toContain('first visit');
    });

    test('mentions the visit total on later visits', () => {
        expect(buildWelcomeMessage(8, 3)).toContain('3 times');
    });
});

describe('initWelcome', () => {
    test('writes the message into the banner element', () => {
        const banner = { textContent: '' };
        const storage = createStorage({});
        const date = new Date(2026, 9, 29, 8, 0, 0);

        const message = initWelcome(banner, storage, date);

        expect(banner.textContent).toBe(message);
        expect(banner.textContent).toContain('Good morrow');
        expect(banner.textContent).toContain('first visit');
    });

    test('does nothing when the banner element is missing', () => {
        expect(initWelcome(null, createStorage({}), new Date())).toBeNull();
    });
});