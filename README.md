# Little World

Started as a terrain-generation test, became a weird little survival game

<a href="evanworks.github.io/little-world">Play now</a>

*NOTE:* does not work sometimes

## Todo

* Add an image directory to all of the objects (res/img/.../...) ?
* Add tutorial / controls
* Add system to obtain crafting recipes
* Pickaxes and such
* Make mining two objects on top of each other work
* Make tile select border show when placing an object on top of another
* Make benches craftable
* Remove white line at the bottom of the world

## Updates

**Sep 6, 2025 -- 0.0.22**

* oops, been busy playing silksong
* sfx

**Sep 2, 2025 -- 0.0.21**

* made the world massive and scrollable
* avoided the important stuff
* but i did allow placing flowerpots
* on top of masonry

**Labor Day, 2025 -- 0.0.20**

r e f a c t o r i n g g g g g g g g

* made masonry and planks not ridiculously expensive
* refactored global variables into state() and globals()
* added seeds ( type seed() in the console to view your seed and share it with your friends for no reason)
* made title screen background black
* fixed 0 wood bug

**Aug 31, 2025 -- 0.0.19**

* fixed a wonderful amazing spelling error
* added play button to readme
* added powerflots

**Aug 30, 2025 -- 0.0.17**

Fun fact: flowers

* probably invasive flowers (i will tweak the spawn chance)

EDIT 0.0.18: Fixed flowers in inventory, tweaked 16x16 flower sprite, fixed spawn chance

**Aug 28, 2025 -- 0.0.16**

Fun fact: I took a "short break"

* Somehow readded things spawning on top of each other???
* Zoomed in the camera, made the world twice as large (just kidding i gave up and died inside)
* added rotation during building (somehow easier than scaling an html elementttttttttttttttt)
* changed masonry to "floor" and made it non-collidable

**Aug 17, 2025 -- 0.0.15**

Fun fact: I add a lot of random stuff to the files

* made masonry look better
* fixed getting stuck on corners of the map
* somehow fixed chopping on corners of the map??
* made plank and masonry drop wood and stone
* removed unnecessary code

**Aug 14, 2025 -- 0.0.13-14**

* Fixed title screen on mobile 
* Didn't fix title screen on mobile and instead crashed out
* Made building less buggy (I think?)
* Made building work on mobile
* feesh

EDIT 0.0.14: Fixed starting with a plank, added masonry

**Aug 13, 2025 -- 0.0.12**

* New frameworks or something
* Made dropping actually work (no more free stuff)
* sort of added building

**Aug 12, 2025 -- 0.0.11**

Fun fact: I'm running out of fun facts

* Fixed mobile (sorry)
* title screen
* that's totally it i promise

**Aug 11, 2025 -- 0.0.9-10**

Fun fact: lag

* Moved the files around for fun
* Made chopping look better

EDIT 0.0.10: Added crafting and dropping

**Aug 10, 2025 -- 0.0.8**

Fun fact: I have a youtube channel now

* Tweaked dead tree spawn chance
* Fixed tiny bug that was actually a gamebreaking item duplication glitch
* Changed chopping logic
* refactoring :)

**Jul 24, 2025 -- 0.0.5-7**

Fun fact: it's a mobile app if you wish hard enough

* Improved wood sprite
* Added padding to the xicon
* Fixed trees and rocks spawning on top of each other
* ~~added large trees~~

EDIT 0.0.6: Reworked grid system, removed large trees (sorry!!)

EDIT 0.0.7: Added buglist to README, fixed some bugs (player spawning), added dead trees


**Jul 23, 2025 -- 0.0.2-4**

Dynamic inventory and mobile support (still very buggy)

EDIT 0.0.3: Improved mobile support (bigger buttons, less touch events, and *v*i*b*r*a*t*i*o*n*)

EDIT 0.0.4: Improved mobile support again and PWA certification

**Jul 22, 2025 -- 0.0.1**

Random terrain gen and coral (doesn't appear in inventory yet)


## Known Bugs

* ~~Destroying plank or masonry creates a magically pointless undefined tile~~
* ~~Pickup animation plays on tiles where a resource is already collected~~
* ~~Pressing CMD plays the pickup animation for some reason???~~
* Crafting bench can spawn on top of a rock
* ~~Opening crafting menu while walking causes it to stay open FOREVER~~
* ~~Game crashes when player is spawned in certain locations~~
* ~~Sometimes the middle of the ocean is a valid spawn location for the player?~~