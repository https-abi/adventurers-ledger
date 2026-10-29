'use strict';

const VISIT_KEY = 'ledgerVisits';

function getTimeOfDay(hour) {
    if (hour >= 5 && hour <= 10) {
        return 'morning';
    }
    if (hour >= 12 && hour <= 16) {
        return 'afternoon';
    }
    if (hour >= 17 && hour <= 20) {
        return 'evening';
    }
    return 'night';
}

function getGreeting(hour) {
    const greetings = {
        morning: 'Good morrow, adventurer. The tavern fire is freshly lit.',
        afternoon: 'Good afternoon, adventurer. The road ahead is bright.',
        evening: 'Good evening, adventurer. Pull up a chair by the hearth.',
        night: 'The night is deep, adventurer. Keep your torch close.'
    };
    return greetings[getTimeOfDay(hour)];
}

function getVisitCount(storage) {
    try {
        const stored = parseInt(storage.getItem(VISIT_KEY), 10);
        const previous = Number.isNaN(stored) || stored < 0 ? 0 : stored;
        const next = previous + 1;
        storage.setItem(VISIT_KEY, String(next));
        return next;
    } catch (error) {
        return 1;
    }
}

function buildWelcomeMessage(hour, visits) {
    const greeting = getGreeting(hour);
    if (visits <= 1) {
        return greeting + ' This is your first visit to the ledger.';
    }
    return greeting + ' You have opened the ledger ' + visits + ' times.';
}

function initWelcome(banner, storage, date) {
    if (!banner) {
        return null;
    }
    const message = buildWelcomeMessage(date.getHours(), getVisitCount(storage));
    banner.textContent = message;
    return message;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        initWelcome(document.getElementById('welcome-banner'), window.localStorage, new Date());
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getTimeOfDay,
        getGreeting,
        getVisitCount,
        buildWelcomeMessage,
        initWelcome
    };
}