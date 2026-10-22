'use strict';

(function () {
    var character = {
        level: 5,
        hp: 32,
        maxHp: 40
    };

    var hpText = document.getElementById('hp-text');
    var hpFill = document.getElementById('hp-fill');
    var hpBar = document.getElementById('hp-bar');
    var levelEl = document.getElementById('char-level');
    var logEl = document.getElementById('combat-log');
    var lastRollEl = document.getElementById('last-roll');
    var countInput = document.getElementById('dice-count');
    var modInput = document.getElementById('dice-mod');

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function renderHp() {
        var percent = (character.hp / character.maxHp) * 100;
        hpText.textContent = character.hp + ' / ' + character.maxHp;
        hpFill.style.width = percent + '%';
        hpBar.setAttribute('aria-valuemax', String(character.maxHp));
        hpBar.setAttribute('aria-valuenow', String(character.hp));

        hpFill.classList.remove('mid', 'low');
        if (percent <= 25) {
            hpFill.classList.add('low');
        } else if (percent <= 60) {
            hpFill.classList.add('mid');
        }
    }

    function timestamp() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function addLog(html) {
        var empty = logEl.querySelector('.log-empty');
        if (empty) {
            logEl.removeChild(empty);
        }
        var item = document.createElement('li');
        item.innerHTML = '<small>[' + timestamp() + ']</small> ' + html;
        logEl.insertBefore(item, logEl.firstChild);
    }

    function rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    function handleRoll(sides) {
        var count = clamp(parseInt(countInput.value, 10) || 1, 1, 20);
        var modifier = clamp(parseInt(modInput.value, 10) || 0, -20, 20);
        var rolls = [];
        var sum = 0;
        var i;

        for (i = 0; i < count; i += 1) {
            var result = rollDie(sides);
            rolls.push(result);
            sum += result;
        }

        var total = sum + modifier;
        var modText = modifier === 0 ? '' : (modifier > 0 ? ' + ' + modifier : ' - ' + Math.abs(modifier));
        var notation = count + 'd' + sides + modText;
        var note = '';

        if (sides === 20 && count === 1) {
            if (rolls[0] === 20) {
                note = ' <span class="crit">Critical hit!</span>';
            } else if (rolls[0] === 1) {
                note = ' <span class="fumble">Critical fumble!</span>';
            }
        }

        lastRollEl.textContent = String(total);
        addLog(
            '<span class="tag">' + notation + '</span>' +
            '[' + rolls.join(', ') + ']' + modText + ' = <strong>' + total + '</strong>' + note
        );
    }

    document.getElementById('dice-buttons').addEventListener('click', function (event) {
        var target = event.target;
        if (target && target.dataset && target.dataset.sides) {
            handleRoll(parseInt(target.dataset.sides, 10));
        }
    });

    document.getElementById('hp-minus').addEventListener('click', function () {
        character.hp = clamp(character.hp - 1, 0, character.maxHp);
        renderHp();
        addLog('Elowen takes 1 damage. HP is now ' + character.hp + '.');
    });

    document.getElementById('hp-plus').addEventListener('click', function () {
        character.hp = clamp(character.hp + 1, 0, character.maxHp);
        renderHp();
        addLog('Elowen recovers 1 HP. HP is now ' + character.hp + '.');
    });

    document.getElementById('level-up').addEventListener('click', function () {
        character.level += 1;
        character.maxHp += 8;
        character.hp = character.maxHp;
        levelEl.textContent = String(character.level);
        renderHp();
        addLog('<span class="crit">Level up!</span> Elowen reaches level ' + character.level + ' and is fully healed.');
    });

    document.getElementById('clear-log').addEventListener('click', function () {
        logEl.innerHTML = '<li class="log-empty">The tavern is quiet. Roll some dice.</li>';
        lastRollEl.textContent = '-';
    });

    renderHp();
}());