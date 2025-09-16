// 🧩 Base class for all rooms in the mansion
class Room {
  constructor(name, description, items = [], characters = [], puzzle = null) {
    this.name = name;
    this.description = description;
    this.items = items;           // Array of Item objects
    this.characters = characters; // Array of Character objects
    this.puzzle = puzzle;         // Optional puzzle function
    this.visited = false;
  }

  // 🧭 Display room details
  enter() {
    this.visited = true;
    let output = `📍 You enter the ${this.name}.\n${this.description}\n`;

    if (this.items.length) {
      output += `🧰 You see: ${this.items.map(item => item.name).join(', ')}\n`;
    }

    if (this.characters.length) {
      output += `🧑‍🤝‍🧑 People here: ${this.characters.map(char => char.name).join(', ')}\n`;
    }

    return output;
  }
}

const library = new Room(
  "Library",
  "Dusty shelves line the walls. A strange book lies open on the desk.",
  [new Item("Ancient Book", "It has a riddle scribbled inside.")],
  [new Character("Butler", "He looks nervous.", () => "🤔 The butler says: 'I saw someone sneaking into the attic last night.'")]
);

const attic = new Room(
  "Attic",
  "Cobwebs hang from the rafters. A locked chest sits in the corner.",
  [new Item("Jewels", "The stolen treasure!", true)],
  [],
  () => "🧩 Solve the puzzle to unlock the chest."
);

const game = new Game([library, attic]);

// 🧸 Items you can collect or interact with
class Item {
  constructor(name, description, isCollectible = true) {
    this.name = name;
    this.description = description;
    this.isCollectible = isCollectible;
  }
}

// 🧑 Characters you can talk to or challenge
class Character {
  constructor(name, description, interaction) {
    this.name = name;
    this.description = description;
    this.interaction = interaction; // Function defining what happens when you interact
  }

  interact() {
    return this.interaction();
  }
}

// 🎮 The main game controller
class Game {
  constructor(rooms) {
    this.rooms = rooms;
    this.currentRoom = null;
    this.inventory = [];
    this.isOver = false;
  }

  start() {
    this.moveTo("Library"); // Start in the Library
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

  checkWinCondition() {
    if (this.inventory.some(i => i.name === "Jewels")) {
      this.isOver = true;
      return `🎉 You found the stolen jewels! You win!`;
    }
    return `🔍 Keep searching...`;
  }
}
