// tigrinho.js

const symbols = [
    { emoji: '🎰', payout: 10, probability: 0.08 },
    { emoji: '🍒', payout: 5, probability: 0.15 },
    { emoji: '🍋', payout: 3, probability: 0.25 },
    { emoji: '🍊', payout: 1.5, probability: 0.48 },
    { emoji: '⭐', payout: 15, probability: 0.05 },
    { emoji: '💰', payout: 50, probability: 0.01 }
];

// Carrega o saldo do localStorage ou define como 100 se não existir
let balance = parseFloat(localStorage.getItem('balance')) || 100;
document.getElementById('balance').textContent = balance.toFixed(2);

function getRandomSymbol() {
    const rand = Math.random();
    let cumulativeProbability = 0;

    for (const symbol of symbols) {
        cumulativeProbability += symbol.probability;
        if (rand <= cumulativeProbability) {
            return symbol;
        }
    }
}

document.querySelector('.spin-btn').addEventListener('click', function() {
    const betInput = document.getElementById('bet-amount');
    const betAmount = parseFloat(betInput.value);
    
    if (betAmount > balance || betAmount <= 0) {
        alert("Aposta inválida. Verifique seu saldo e tente novamente.");
        return;
    }

    balance -= betAmount;
    document.getElementById('balance').textContent = balance.toFixed(2);

    const lines = document.querySelectorAll('.line');
    const resultText = document.getElementById('result-text');
    const spinButton = document.querySelector('.spin-btn');
    spinButton.disabled = true;

    lines.forEach((line, lineIndex) => {
        const slots = line.querySelectorAll('.slot');
        slots.forEach((slot, index) => {
            setTimeout(() => {
                const randomSymbol = getRandomSymbol();
                slot.textContent = randomSymbol.emoji;
                slot.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    slot.style.transform = 'scale(1)';
                }, 300);
            }, index * 300 + lineIndex * 300);
        });
    });

    setTimeout(() => {
        const outcomes = Array.from(lines).map(line => 
            Array.from(line.querySelectorAll('.slot')).map(slot => slot.textContent).join(' ')
        );
        resultText.textContent = `Você girou: ${outcomes.join(' | ')}`;

        let winAmount = 0;

        lines.forEach(line => {
            const slots = line.querySelectorAll('.slot');
            const symbolsInLine = Array.from(slots).map(slot => slot.textContent);
            if (symbolsInLine[0] === symbolsInLine[1] && symbolsInLine[1] === symbolsInLine[2]) {
                const matchedSymbol = symbols.find(s => s.emoji === symbolsInLine[0]);
                if (matchedSymbol) {
                    winAmount += betAmount * matchedSymbol.payout;
                }
            }
        });

        if (winAmount > 0) {
            balance += winAmount;
            resultText.textContent += ` | Você ganhou: R$ ${winAmount.toFixed(2)}`;
        }

        document.getElementById('balance').textContent = balance.toFixed(2);
        localStorage.setItem('balance', balance.toFixed(2)); // Salva o saldo no localStorage

        setTimeout(() => {
            spinButton.disabled = false;
        }, 2000);
    }, lines.length * 300);
});
