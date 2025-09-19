Week 3 - Project Brief:

The aim of this project is to create a text based adventure game using Object Oriented
Programming techniques in JavaScript.

Extra bragging rights will be awarded for creativity in the subject and presentation of your game.
Your Project

The game should be created using HTML, CSS and JavaScript. The game should include the
following functionality:

1. A Single HTML page; the user should not move from the page when playing the
game.

2. The ability to move around the game to different “rooms”.
  
3. The display of a description of the room when the adventurer enters the room.

4. The display of a description of any objects or characters who are in the room.
   
5. The ability to interact with characters and /or objects / rooms in the game (e.g. fight a
character, solve a puzzle, collect an object).

6. The ability to “lose” the game if certain conditions occur (e.g. in interaction with a
character, object or room).

7. The ability to “win” the game if certain conditions occur (e.g. in interaction with a
character, object or room).

Deliverables:

The address for the GitHub repository.
The address for the GitHub pages.

Extension:

Create a win condition that is dependent on several actions during the game (defeat several
enemy characters, collect objects from friendly characters and defeat a final “boss” character)
Reuse the classes and methods to create a second game in a different setting (the second
game could be much simpler and only include navigation around the setting).

Known Bugs:

BF1 - Puzzle field not clearing after visiting room - resolved 17/09
BF2 - Audio not working - resolved for room entry 'mystic.mp3' 18/09

Design & Planning:

Game summary - classic 'whodunnit' involving characters in a stateley home with the objective of discovering who stole the family fortune. Different rooms, items to collect, characters and puzzles are presented.

By definition Object-Oriented Programming (OOP) is a methodology where you model real-world entities as objects. Each object is an instance of a class, which defines its properties and behaviors. In this game
OOP is implemented as follows:
 
- Represent rooms, items, and characters as reusable objects
- Encapsulate logic inside methods (like .enter() or .interact())
- Code is modular and easy to extend
- Four core classes defined (Room, Item, Character, Game)
- Each class has Properties (e.g. name, description, items) and Methods (e.g. enter(), interact())
- Each class contains its own logic:
- Room.enter() handles what happens when you enter a room
- Room.solvePuzzle(answer) checks if the puzzle is solved
- Character.interact() returns dialogue
- Game.moveTo(roomName) changes the current room
Each object tracks its own state:
• 	 let you know if a room has been explored or its puzzle completed
• 	 stores collected items
• 	 keeps track of where the player is
   
Future enhancements:
1) More characters per room
2) Add more inventory
3) Cleaner interface as needs to adapt to different screen sizes (only tested on larger monitors)
4) It would be great have animations alongsdie sound working correctly to better engage end user
5) Clearer navigation to rooms

