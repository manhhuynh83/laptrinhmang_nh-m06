function determineWinner(p1, p2) {
    if (p1.choice === p2.choice)
        return { winner: "draw", message: "Hòa!" };

    const win =
        (p1.choice === "rock" && p2.choice === "scissors") ||
        (p1.choice === "scissors" && p2.choice === "paper") ||
        (p1.choice === "paper" && p2.choice === "rock");

    return win
        ? { winner: "p1", message: `${p1.name} thắng!` }
        : { winner: "p2", message: `${p2.name} thắng!` };
}

function getChoiceEmoji(c) {
    return { rock: "✊", paper: "✋", scissors: "✌️" }[c];
}

module.exports = { determineWinner, getChoiceEmoji };
