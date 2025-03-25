const { Game, PieceType, Turn, toIndex } = require('../dist/index');

function createInitialPosition() {
  // Create a simple starting position with some pieces
  const rows = [
    '11/11/11/11/11/11/11/11/11/11/11/11', // Empty board
    '6c4/1n2fh1hf2/3a2s2a1/2n1gt1tg2/2ie2m2ei/10/10/2IE2M2EI/2N1GT1TG2/3A2S2A1/1N2FH1HF2/6C4', // Basic setup
  ];
  return rows[1]; // Return the basic setup
}

function demo() {
  // Initialize game with starting position
  const game = new Game(createInitialPosition());
  console.log('Initial board:');
  console.log(game.toString());

  // Make some moves
  const moves = [
    // Move RED's engineer forward (from initial position)
    [
      { x: 3, y: 7 },
      { x: 3, y: 6 },
    ],
    // Move BLUE's militia forward
    [
      { x: 5, y: 4 },
      { x: 5, y: 5 },
    ],
    // Move RED's tank forward
    [
      { x: 5, y: 8 },
      { x: 5, y: 7 },
    ],
  ];

  // Execute moves
  moves.forEach((move, index) => {
    const [from, to] = move;
    const success = game.makeMove(from, to);
    console.log(`\nMove ${index + 1}:`);
    if (success) {
      console.log(`Successfully moved from (${from.x},${from.y}) to (${to.x},${to.y})`);
    } else {
      console.log(`Failed to move from (${from.x},${from.y}) to (${to.x},${to.y})`);
    }
    console.log(game.toString());

    // Show legal moves for a piece
    const piece = game.getPiece(toIndex(to));
    if (piece) {
      const legalMoves = game.getValidMoves(piece);
      console.log(`Legal moves for piece at (${to.x},${to.y}):`);
      console.log(legalMoves.map(pos => `(${pos.x},${pos.y})`).join(', '));
    }
  });
}

// Run the demo
demo();
