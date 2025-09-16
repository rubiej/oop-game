// ==========================
// 🧱 CLASS DEFINITIONS
// ==========================

// Represents a room in the mansion
class Room {
  constructor(name, description, items = [], characters = [], puzzle = null) {
    this.name = name;
    this.description = description;
    this.items = items;
    this.characters = characters;
    this.puzzle = puzzle;
    this.visited = false;
    this.solved = false;
  }

  // Called when player enters the room
  enter() {
    this.visited = true;
    let output = `📍 You enter the ${this.name}.\n${this.description}\n`;

    if (this.puzzle && !this.solved) {
      output += `🧩 Puzzle: ${this.puzzle.question}\n`;
      this.puzzle.options.forEach(opt => {
        output += `- ${opt}\n`;
      });
    }

    if (this.items.length) {
      output += `🧰 Items here: ${this.items.map(i => i.name).join(', ')}\n`;
    }

    if (this.characters.length) {
      output += `🧑‍🤝‍🧑 People here: ${this.characters.map(c => c.name).join(', ')}\n`;
    }

    return output;
  }

  // Called when player attempts to solve the room's puzzle
  solvePuzzle(answer) {
    if (this.puzzle && answer === this.puzzle.answer) {
      this.solved = true;
      return `✅ Correct! You've solved the puzzle in the ${this.name}.`;
    }
    return `❌ That's not the right answer.`;
  }
}

// Represents an item in the game
class Item {
  constructor(name, description, isCollectible = true) {
    this.name = name;
    this.description = description;
    this.isCollectible = isCollectible;
  }
}

// Represents a character the player can interact with
class Character {
  constructor(name, description, interaction) {
    this.name = name;
    this.description = description;
    this.interaction = interaction;
  }

  interact() {
    return this.interaction();
  }
}

// Main game controller
class Game {
  constructor(rooms) {
    this.rooms = rooms;
    this.currentRoom = null;
    this.inventory = [];
    this.isOver = false;
    this.suspectRevealed = false;
  }

  start() {
    return this.moveTo("Library");
  }

  moveTo(roomName) {
    const room = this.rooms.find(r => r.name === roomName);
    if (!room) return `🚫 Room not found.`;

    this.currentRoom = room;
    return room.enter();
  }

  collectItem(itemName) {
    const item = this.currentRoom.items.find(i => i.name === itemName);
    if (item && item.isCollectible) {
      this.inventory.push(item);
      this.currentRoom.items = this.currentRoom.items.filter(i => i.name !== itemName);
      return `✅ You picked up the ${item.name}.`;
    }
    return `❌ You can't collect that.`;
  }

  interactWith(characterName) {
    const char = this.currentRoom.characters.find(c => c.name === characterName);
    return char ? char.interact() : `❌ No one by that name here.`;
  }

  solveCurrentPuzzle(answer) {
    return this.currentRoom.solvePuzzle(answer);
  }

  checkWinCondition() {
    const allSolved = this.rooms.every(r => r.solved);
    const hasJewels = this.inventory.some(i => i.name === "Jewels");

    if (allSolved && hasJewels) {
      this.isOver = true;
      return this.finalConfrontation();
    }
    return `🔍 Keep exploring...`;
  }

  finalConfrontation() {
    this.suspectRevealed = true;
    return `🎭 Final Confrontation:\nYou gather the suspects in the grand hall.\nWho do you accuse?\n- Butler\n- Gardener\n- Maid`;
  }

  accuse(name) {
    if (!this.suspectRevealed) return `❌ You haven't reached the confrontation yet.`;

    if (name === "Maid") {
      return `😱 The Maid gasps. "You figured it out... I did it. I had to. My brother was framed by this family years ago."\n🎉 You solved the mystery!`;
    } else {
      return `🤔 ${name} looks confused. "I had nothing to do with it!"\n❌ Wrong accusation. The real thief escapes...`;
    }
  }
}

// ==========================
// 🏰 ROOM SETUP
// ==========================

const library = new Room(
  "Library",
  "Dusty shelves line the walls. A strange book lies open on the desk.",
  [new Item("Ancient Book", "It has a riddle scribbled inside.")],
  [new Character("Butler", "He looks nervous.", () => "🤔 The butler whispers: 'I saw someone sneaking into the attic last night.'")],
  {
    question: "Which book title doesn’t belong?",
    options: ["War and Peace", "1984", "Toaster Manual", "Jane Eyre"],
    answer: "Toaster Manual"
  }
);

const conservatory = new Room(
  "Conservatory",
  "Sunlight filters through cracked glass. A muddy glove lies near a fern.",
  [new Item("Torn Glove", "It’s stained with soil.")],
  [new Character("Gardener", "He avoids eye contact.", () => "🌱 The gardener mutters: 'I clean up after everyone. Even their secrets.'")],
  {
    question: "Which plant is fictional?",
    options: ["Fern", "Rose", "Snargleweed", "Tulip"],
    answer: "Snargleweed"
  }
);

const study = new Room(
  "Study",
  "A fire crackles. A banana sits oddly on the desk.",
  [new Item("Letter Opener", "It has soil on the blade.")],
  [new Character("Maid", "She offers you tea.", () => "☕ The maid smiles: 'I always keep things tidy. Even the truth.'")],
  {
    question: "Which object doesn’t belong?",
    options: ["Pen", "Notebook", "Banana", "Lamp"],
    answer: "Banana"
  }
);

const attic = new Room(
  "Attic",
  "Cobwebs hang from the rafters. A locked chest sits in the corner.",
  [new Item("Jewels", "The stolen treasure!")],
  [],
  {
    question: "Which sound doesn’t fit?",
    options: ["Creak", "Whistle", "Growl", "Silence"],
    answer: "Growl"
  }
);

const game = new Game([library, conservatory, study, attic]);

// ==========================
// 🎮 DOM INTERACTIONS
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  // Start game
  document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    updateRoom(game.start());
    updateInventory();
  });

  // ✅ FIXED: Room navigation via dropdown
  document.getElementById("roomSelect").addEventListener("change", e => {
    const selectedRoom = e.target.value;
    updateRoom(game.moveTo(selectedRoom));
    updateInventory();
  });

  // Talk to character
  document.getElementById("interactBtn").addEventListener("click", () => {
    const char = game.currentRoom.characters[0];
    updateRoom(char ? game.interactWith(char.name) : "❌ No one to talk to here.");
  });

  // Collect item
  document.getElementById("collectBtn").addEventListener("click", () => {
    const item = game.currentRoom.items[0];
    const result = item ? game.collectItem(item.name) : "❌ Nothing to collect here.";
    updateRoom(`${result}\n${game.checkWinCondition()}`);
    updateInventory();
  });

  // Solve puzzle
  document.getElementById("solveBtn").addEventListener("click", () => {
    const answer = document.getElementById("answerInput").value.trim();
    if (answer) {
      const result = game.solveCurrentPuzzle(answer);
      updateRoom(`${result}\n${game.checkWinCondition()}`);
    }
  });
 
    // Final accusation
  document.getElementById("accuseBtn").addEventListener("click", () => {
    const suspect = document.getElementById("suspectInput").value.trim();
    if (suspect) {
      updateRoom(game.accuse(suspect));
    }
  });

  // Restart game
  document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
  });
});

// ✅ Utility function to update room text
function updateRoom(text) {
  document.getElementById("roomOutput").textContent = text;
}

// ✅ Utility function to update inventory display
function updateInventory() {
  const inv = game.inventory.map(i => `- ${i.name}: ${i.description}`).join('\n');
  document.getElementById("inventory").textContent = inv || "👜 Inventory is empty.";
}
