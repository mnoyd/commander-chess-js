const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 12;
const BOARD_MASK = 0xf0;

type Position = {
  x: number;
  y: number;
};

enum Terrain {
  LAND = 'LAND',
  SEA = 'SEA',
}

// Update MovementPattern interface
interface MovementPattern {
  maxRange: number;
  directions: number[];
  diagonalRange?: number;
  diagonalDirections?: number[];
  attackRange?: number;
}

// Update getValidMoves method in Board class to handle diagonal moves for missile
// Add DIRECTIONS before PIECE_PATTERNS
const DIRECTIONS = {
  N: -16, // Move up (decrease y)
  S: 16, // Move down (increase y)
  E: 1, // Move right (increase x)
  W: -1, // Move left (decrease x)
  NE: -15, // Move up-right
  SE: 17, // Move down-right
  SW: 15, // Move down-left
  NW: -17, // Move up-left
};

type RayCache = {
  [key: number]: {
    [direction: number]: Position[];
  };
};

const RAYS: RayCache = {};

// You can call this after precomputeRays() to see the results
// Change PieceType to PieceType
enum PieceType {
  INFANTRY = 'INFANTRY',
  ENGINEER = 'ENGINEER',
  MILITIA = 'MILITIA',
  TANK = 'TANK',
  ARTILLERY = 'ARTILLERY',
  MISSILE = 'MISSILE',
  ANTI_AIR = 'ANTI_AIR',
  AIR_FORCE = 'AIR_FORCE',
  NAVY = 'NAVY',
  COMMANDER = 'COMMANDER', // Added Commander
}

// Update MovementPattern interface reference
interface MovementPattern {
  maxRange: number;
  directions: number[];
  diagonalRange?: number;
  diagonalDirections?: number[];
  attackRange?: number;
}

// Update PIECE_PATTERNS to PIECE_PATTERNS
const PIECE_PATTERNS: Record<PieceType, MovementPattern> = {
  [PieceType.INFANTRY]: {
    maxRange: 1,
    directions: [DIRECTIONS.N, DIRECTIONS.E, DIRECTIONS.S, DIRECTIONS.W],
  },
  [PieceType.ENGINEER]: {
    maxRange: 1,
    directions: [DIRECTIONS.N, DIRECTIONS.E, DIRECTIONS.S, DIRECTIONS.W],
  },
  [PieceType.MILITIA]: {
    maxRange: 1,
    directions: Object.values(DIRECTIONS),
  },
  [PieceType.TANK]: {
    maxRange: 2,
    directions: [DIRECTIONS.N, DIRECTIONS.E, DIRECTIONS.S, DIRECTIONS.W],
  },
  [PieceType.ARTILLERY]: {
    maxRange: 3,
    directions: Object.values(DIRECTIONS),
    attackRange: 3,
  },
  [PieceType.MISSILE]: {
    maxRange: 2,
    directions: [DIRECTIONS.N, DIRECTIONS.E, DIRECTIONS.S, DIRECTIONS.W],
    diagonalRange: 1,
    diagonalDirections: [DIRECTIONS.NE, DIRECTIONS.SE, DIRECTIONS.SW, DIRECTIONS.NW],
    attackRange: 4,
  },
  [PieceType.ANTI_AIR]: {
    maxRange: 1,
    directions: [DIRECTIONS.N, DIRECTIONS.E, DIRECTIONS.S, DIRECTIONS.W],
    attackRange: 2,
  },
  [PieceType.AIR_FORCE]: {
    maxRange: 4,
    directions: Object.values(DIRECTIONS),
    attackRange: 3,
  },
  [PieceType.NAVY]: {
    maxRange: 4,
    directions: Object.values(DIRECTIONS),
    attackRange: 3,
  },
  // Added Commander pattern
  [PieceType.COMMANDER]: {
    maxRange: Math.max(BOARD_WIDTH, BOARD_HEIGHT), // Effectively unlimited straight movement
    directions: [DIRECTIONS.N, DIRECTIONS.E, DIRECTIONS.S, DIRECTIONS.W],
    attackRange: 1, // Can only attack adjacent pieces
  },
};

type BoardIndex = number;

function toIndex(pos: Position): BoardIndex {
  return (pos.y << 4) | pos.x;
}

function toPosition(index: BoardIndex): Position {
  return {
    x: index & 0xf,
    y: index >> 4,
  };
}

function isValidIndex(index: BoardIndex): boolean {
  // Check if x is within width and y is within height
  // Removed incorrect '(index & BOARD_MASK) === 0 &&' check
  return (index & 0xf) < BOARD_WIDTH && index >> 4 < BOARD_HEIGHT;
}

// Add after isValidIndex function
function precomputeRays() {
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const startIndex = toIndex({ x, y });
      RAYS[startIndex] = {};

      for (const direction of Object.values(DIRECTIONS)) {
        const ray: Position[] = [];
        let currentIndex = startIndex;

        while (true) {
          currentIndex += direction;
          if (!isValidIndex(currentIndex)) break;
          ray.push(toPosition(currentIndex));
        }

        RAYS[startIndex][direction] = ray;
      }
    }
  }
}

// Add after the precomputeRays function
function printRays() {
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const startIndex = toIndex({ x, y });
      console.log(`\nRays from position (${x}, ${y}):`);

      for (const [dirKey, dir] of Object.entries(DIRECTIONS)) {
        const ray = RAYS[startIndex][dir];
        console.log(`${dirKey}: ${ray.map(pos => `(${pos.x},${pos.y})`).join(' -> ')}`);
      }
    }
  }
}

// Rename Piece class to Piece
class Piece {
  private index: BoardIndex;

  constructor(
    public type: PieceType,
    position: Position,
    public player: number,
  ) {
    this.index = toIndex(position);
  }

  get position(): Position {
    return toPosition(this.index);
  }

  set position(pos: Position) {
    this.index = toIndex(pos);
  }

  getMovementPattern(): MovementPattern {
    return PIECE_PATTERNS[this.type];
  }
}

// Add piece symbols to PieceType
interface PieceInfo {
  symbol: string;
  shortcut: string;
}

// Update UNIT_INFO to PIECE_INFO
const PIECE_INFO: Record<PieceType, PieceInfo> = {
  [PieceType.INFANTRY]: { symbol: 'i', shortcut: 'I' },
  [PieceType.ENGINEER]: { symbol: 'e', shortcut: 'E' },
  [PieceType.MILITIA]: { symbol: 'm', shortcut: 'M' },
  [PieceType.TANK]: { symbol: 't', shortcut: 'T' },
  [PieceType.ARTILLERY]: { symbol: 'a', shortcut: 'A' },
  [PieceType.MISSILE]: { symbol: 's', shortcut: 'S' },
  [PieceType.ANTI_AIR]: { symbol: 'g', shortcut: 'G' },
  [PieceType.AIR_FORCE]: { symbol: 'f', shortcut: 'F' },
  [PieceType.NAVY]: { symbol: 'n', shortcut: 'N' },
  [PieceType.COMMANDER]: { symbol: 'c', shortcut: 'C' }, // Added Commander info
};

// Add this before the Game class
enum Turn {
  RED = 1,
  BLUE = 2,
}

class Game {
  private pieces: (Piece | null)[];
  private turn: Turn = Turn.RED;
  private moveHistory: Move[] = [];
  private turnNumber: number = 1;

  constructor(fen?: string) {
    this.pieces = new Array(256).fill(null);
    if (Object.keys(RAYS).length === 0) {
      precomputeRays();
    }
    if (fen) {
      this.loadFEN(fen);
    }
  }

  getPiece(index: BoardIndex): Piece | null {
    return this.pieces[index];
  }

  // Update getValidMoves to use rays
  getValidMoves(piece: Piece): Position[] {
    const pattern = piece.getMovementPattern();
    const validMoves: Position[] = [];
    const startIndex = toIndex(piece.position);

    for (const direction of pattern.directions) {
      const ray = RAYS[startIndex][direction];
      for (let i = 0; i < Math.min(ray.length, pattern.maxRange); i++) {
        const pos = ray[i];
        const targetPiece = this.getPiece(toIndex(pos));

        if (targetPiece) {
          if (targetPiece.player !== piece.player) {
            validMoves.push(pos);
          }
          break;
        }
        validMoves.push(pos);
      }
    }

    // Handle diagonal moves for pieces like missile
    if (pattern.diagonalDirections && pattern.diagonalRange) {
      for (const direction of pattern.diagonalDirections) {
        const ray = RAYS[startIndex][direction];
        for (let i = 0; i < Math.min(ray.length, pattern.diagonalRange); i++) {
          const pos = ray[i];
          const targetPiece = this.getPiece(toIndex(pos));

          if (targetPiece) {
            if (targetPiece.player !== piece.player) {
              validMoves.push(pos);
            }
            break;
          }
          validMoves.push(pos);
        }
      }
    }

    return validMoves;
  }

  // Update getValidAttacks to use rays
  getValidAttacks(piece: Piece): Position[] {
    const pattern = piece.getMovementPattern();
    if (!pattern.attackRange) return [];

    const attacks: Position[] = [];
    const startIndex = toIndex(piece.position);

    for (const direction of pattern.directions) {
      const ray = RAYS[startIndex][direction];
      for (let i = 0; i < Math.min(ray.length, pattern.attackRange); i++) {
        const pos = ray[i];
        const targetPiece = this.getPiece(toIndex(pos));

        if (targetPiece && targetPiece.player !== piece.player) {
          attacks.push(pos);
        }
      }
    }

    return attacks;
  }

  makeMove(from: Position, to: Position): boolean {
    const piece = this.getPiece(toIndex(from));
    if (!piece || piece.player !== this.turn) return false;

    const newIndex = toIndex(to);
    if (!isValidIndex(newIndex)) return false;

    const validMoves = this.getValidMoves(piece);
    if (!validMoves.some(pos => toIndex(pos) === newIndex)) return false;

    const oldIndex = toIndex(piece.position);
    const targetPiece = this.pieces[newIndex];

    if (targetPiece) {
      this.pieces[newIndex] = null;
    }

    this.pieces[oldIndex] = null;
    this.pieces[newIndex] = piece;
    piece.position = to;

    this.moveHistory.push({ from, to, piece, isAttack: false });
    this.switchPlayer();
    return true;
  }

  makeAttack(from: Position, target: Position): boolean {
    const attacker = this.getPiece(toIndex(from));
    if (!attacker || attacker.player !== this.turn) return false;

    const targetIndex = toIndex(target);
    const validAttacks = this.getValidAttacks(attacker);

    if (!validAttacks.some(pos => toIndex(pos) === targetIndex)) return false;

    const targetPiece = this.pieces[targetIndex];
    if (!targetPiece || targetPiece.player === attacker.player) return false;

    this.pieces[targetIndex] = null;
    this.moveHistory.push({
      from,
      to: target,
      piece: attacker,
      captured: targetPiece,
      isAttack: true,
    });
    this.switchPlayer();
    return true;
  }

  getAllLegalMoves(): Map<Position, Position[]> {
    const moves = new Map<Position, Position[]>();

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const index = toIndex({ x, y });
        const piece = this.pieces[index];

        if (piece && piece.player === this.turn) {
          const validMoves = this.getValidMoves(piece);
          const validAttacks = this.getValidAttacks(piece);
          moves.set(piece.position, [...validMoves, ...validAttacks]);
        }
      }
    }

    return moves;
  }

  getCurrentTurn(): Turn {
    return this.turn;
  }

  // Update other methods to use Turn
  private switchPlayer(): void {
    this.turn = this.turn === Turn.RED ? Turn.BLUE : Turn.RED;
    if (this.turn === Turn.RED) this.turnNumber++;
  }

  loadFEN(fen: string): boolean {
    const rows = fen.split('/');
    if (rows.length !== BOARD_HEIGHT) return false;

    this.pieces = new Array(256).fill(null);

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      let x = 0;
      for (const char of rows[y]) {
        if (/\d/.test(char)) {
          x += parseInt(char);
        } else {
          const isUpperCase = char === char.toUpperCase();
          const player = isUpperCase ? 1 : 2;
          const type = Object.entries(PIECE_INFO).find(
            ([_, info]) => info.symbol === char.toLowerCase(),
          )?.[0] as PieceType;

          if (type) {
            const piece = new Piece(type, { x, y }, player);
            const index = toIndex({ x, y });
            this.pieces[index] = piece;
          }
          x++;
        }
      }
    }

    return true;
  }

  toFEN(): string {
    let fen = '';
    let emptyCount = 0;

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const index = toIndex({ x, y });
        const piece = this.pieces[index];

        if (!piece) {
          emptyCount++;
          continue;
        }

        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }

        const symbol = PIECE_INFO[piece.type].symbol;
        fen += piece.player === 1 ? symbol.toUpperCase() : symbol.toLowerCase();
      }

      if (emptyCount > 0) {
        fen += emptyCount;
        emptyCount = 0;
      }

      if (y < BOARD_HEIGHT - 1) {
        fen += '/';
      }
    }

    return fen;
  }

  toString(): string {
    let result = '';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const index = toIndex({ x, y });
        const piece = this.pieces[index];
        if (piece) {
          const shortcut = PIECE_INFO[piece.type].shortcut;
          result += piece.player === 1 ? shortcut : shortcut.toLowerCase();
        } else {
          result += '.';
        }
        result += ' ';
      }
      result += '\n';
    }
    return `Turn ${this.turnNumber}, Player ${this.turn}\n${result}`;
  }
}

// Update exports at the end of the file
interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isAttack: boolean;
}
