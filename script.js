class Room {
  constructor(name, description, items = [], characters = []) {
    this.name = name;
    this.description = description;
    this.items = items;
    this.characters = characters;
    this.visited = false;
  }

  enter() {
    this.visited = true;
    let output = `📍 You enter the ${this.name}.\n${this.description}\n`;

    if (this.items.length) {
      output += `🧰 Items here: ${this.items.map(i => i.name).join(', ')}\n`;
    }

    if (this.characters.length) {
      output += `🧑‍🤝‍🧑 People here: ${this.characters.map(c => c.name).join(', ')}\n`;
    }

    return output;
  }
}

class Item {
  constructor(name, description, isCollectible = true) {
    this.name = name;
    this.description = description;
    this.isCollectible = isCollectible;
  }
}

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

class Game {
  constructor(rooms) {
    this.rooms = rooms;
    this.currentRoom = null;
    this.inventory = [];
    this.isOver = false;
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

  checkWinCondition() {
    if (this.inventory.some(i => i.name === "Ancient Book")) {
      this.isOver = true;
      return `🎉 You found the first clue! The mystery deepens...`;
    }
    return `🔍 Keep exploring...`;
  }
}

// Room setup
const library = new Room(
  "Library",
  "Dusty shelves line the walls. A strange book lies open on the desk.",
  [new Item("Ancient Book", "It has a riddle scribbled inside.")],
  [new Character("Butler", "He looks nervous.", () => "🤔 The butler whispers: 'I saw someone sneaking into the attic last night.'")]
);

const game = new Game([library]);

// DOM interactions
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    updateRoom(game.start());
  });

  document.getElementById("interactBtn").addEventListener("click", () => {
    const text = game.interactWith("Butler");
    updateRoom(text);
  });

  document.getElementById("collectBtn").addEventListener("click", () => {
    const text = game.collectItem("Ancient Book");
    const win = game.checkWinCondition();
    updateRoom(`${text}\n${win}`);

    if (game.isOver) {
      document.getElementById("game").classList.add("hidden");
      document.getElementById("result").classList.remove("hidden");
      document.getElementById("resultText").textContent = win;
    }
  });

  document.getElementById("reenterBtn").addEventListener("click", () => {
    updateRoom(game.moveTo("Library"));
  });

  document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
  });
});

function updateRoom(text) {
  document.getElementById("roomOutput").textContent = text;
}
