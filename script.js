const game = new Chess();
let pendingMove = null;
function updateUI() {
    const statusEl = document.getElementById('status-display');
    
    if (game.in_checkmate()) {
        statusEl.innerText = "Checkmate! The game is over.";
    } else {
        let warning = game.in_check() ? " (CHECK!)" : "";
        let turn = game.turn() === 'w' ? "White's turn" : "Black's turn";
        statusEl.innerText = turn + warning;
    }
}
const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: (source, piece) => !game.game_over(),
    onDrop: (source, target) => {
        const move = game.move({ from: source, to: target, promotion: 'q' });
        
        if (move === null) return 'snapback';
  
        if (move.flags.includes('p')) {
            game.undo();
            pendingMove = { from: source, to: target };
            document.getElementById('promoModal').style.display = 'flex';
            return;
        }
        updateUI();
    },
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
});
window.handlePromotion = (piece) => {
    game.move({ from: pendingMove.from, to: pendingMove.to, promotion: piece });
    board.position(game.fen());
    document.getElementById('promoModal').style.display = 'none';
    updateUI();
};
document.getElementById('fsBtn').onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
};
document.getElementById('guideBtn').onclick = () => alert("Drag and drop to move. Watch out for Check!");

updateUI();