import { Game, PieceType, toIndex } from '../dist/index.js';

// FEN string including Commanders (replaced central Militias)
const initialFen = '6c4/1n2fh1hf2/3a2s2a1/2n1gt1tg2/2ie2c2ei/10/10/2IE2C2EI/2N1GT1TG2/3A2S2A1/1N2FH1HF2/6C4';

function demo() {
  // Initialize game with starting position
  const game = new Game(initialFen);
  console.log('Initial board (Turn 1 - RED):');
  console.log(game.toString());
  console.log(`Initial FEN: ${game.toFEN()}`); // Show initial FEN matches input

  // --- Move 1: RED Engineer moves ---
  const move1From = { x: 3, y: 7 };
  const move1To = { x: 3, y: 6 };
  let success = game.makeMove(move1From, move1To);
  console.log(
    `\n--- After RED moves Engineer (${move1From.x},${move1From.y}) to (${move1To.x},${move1To.y}) ---`,
  );
  if (success) {
    console.log('Move successful. Board (Turn 1 - BLUE):');
    console.log(game.toString());
    const movedPiece = game.getPiece(toIndex(move1To));
    if (movedPiece) {
      const legalMoves = game.getValidMoves(movedPiece);
      console.log(
        `Legal moves for Engineer at (${move1To.x},${move1To.y}): ${legalMoves.map(pos => `(${pos.x},${pos.y})`).join(', ')}`,
      );
    }
  } else {
    console.log('Move failed!');
  }

  // --- Move 2: BLUE Commander moves ---
  const move2From = { x: 6, y: 4 }; // BLUE Commander position
  const move2To = { x: 6, y: 5 };
  success = game.makeMove(move2From, move2To);
  console.log(
    `\n--- After BLUE moves Commander (${move2From.x},${move2From.y}) to (${move2To.x},${move2To.y}) ---`,
  );
  if (success) {
    console.log('Move successful. Board (Turn 2 - RED):');
    console.log(game.toString());
  } else {
    console.log('Move failed!');
  }

  // --- Move 3: RED Commander moves ---
  const move3From = { x: 6, y: 7 }; // RED Commander position
  const move3To = { x: 6, y: 6 };
  success = game.makeMove(move3From, move3To);
  console.log(
    `\n--- After RED moves Commander (${move3From.x},${move3From.y}) to (${move3To.x},${move3To.y}) ---`,
  );
  if (success) {
    console.log('Move successful. Board (Turn 2 - BLUE):');
    console.log(game.toString());
    const movedPiece = game.getPiece(toIndex(move3To));
    if (movedPiece) {
      const legalMoves = game.getValidMoves(movedPiece);
      console.log(
        `Legal moves for Commander at (${move3To.x},${move3To.y}): ${legalMoves.map(pos => `(${pos.x},${pos.y})`).join(', ')}`,
      );
      const legalAttacks = game.getValidAttacks(movedPiece);
      console.log(
        `Legal attacks for Commander at (${move3To.x},${move3To.y}): ${legalAttacks.map(pos => `(${pos.x},${pos.y})`).join(', ')}`,
      );
    }
  } else {
    console.log('Move failed!');
  }

  // --- Move 4: BLUE Engineer moves ---
  const move4From = { x: 7, y: 4 }; // BLUE Engineer
  const move4To = { x: 7, y: 5 };
  success = game.makeMove(move4From, move4To);
  console.log(
    `\n--- After BLUE moves Engineer (${move4From.x},${move4From.y}) to (${move4To.x},${move4To.y}) ---`,
  );
  if (success) {
    console.log('Move successful. Board (Turn 3 - RED):');
    console.log(game.toString());
  } else {
    console.log('Move failed!');
  }

  // --- Move 5: RED Commander attacks BLUE Commander ---
  const attackFrom = { x: 6, y: 6 }; // RED Commander moved here
  const attackTarget = { x: 6, y: 5 }; // BLUE Commander moved here
  success = game.makeAttack(attackFrom, attackTarget); // Use makeAttack
  console.log(
    `\n--- After RED Commander (${attackFrom.x},${attackFrom.y}) attacks BLUE Commander (${attackTarget.x},${attackTarget.y}) ---`,
  );
  if (success) {
    console.log('Attack successful! Board (Turn 3 - BLUE):');
    console.log(game.toString());
  } else {
    console.log('Attack failed!');
    const attacker = game.getPiece(toIndex(attackFrom));
    if (attacker) {
      const validAttacks = game.getValidAttacks(attacker);
      console.log(
        `Valid attacks for Commander at (${attackFrom.x},${attackFrom.y}): ${validAttacks.map(pos => `(${pos.x},${pos.y})`).join(', ')}`,
      );
    }
  }

  // --- Show final FEN ---
  console.log(`\nFinal FEN: ${game.toFEN()}`);

  // --- Show all legal moves for current player (BLUE) ---
  const allMoves = game.getAllLegalMoves();
  console.log('\nAll legal moves/attacks for current player (BLUE):');
  for (const [fromPos, toPositions] of allMoves.entries()) {
    console.log(
      `  Piece at (${fromPos.x},${fromPos.y}): ${toPositions.map(p => `(${p.x},${p.y})`).join(', ')}`,
    );
  }
}

// Run the demo
demo();
