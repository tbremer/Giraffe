Changelog
----

### Tue Jan 17 12:42:20 2017 -0600
- Commit: `b1a28b229c6801a8a59b45425d48b83ce3cf5279`
- Author: Tom Bremer ([tom@tbremer.com](tom@tbremer.com))
- Version 2.1.0

#### Changes
- Add changed data to callback for `remove` method
- Update test
- Update README to show the callback table.


### Tue Jan 10 10:38:54 2017 -0600
- Commit: `c5beec827944a4e1d5e50b375f729796cbe0a9bf`
- Author: Tom Bremer ([tom@tbremer.com](tom@tbremer.com))
- Version 2.0.1

#### Changes
- Update README with new TODO Project


### Tue Jan 10 10:33:59 2017 -0600
- Commit: `6fdf1043def44abc2aeb900ccd39fc564b3b7d1d`
- Author: Tom Bremer ([tom@tbremer.com](tom@tbremer.com))
- Version 2.0.0

#### Changes
- Update `Node` & `Edge` id creation.
- Splice `Node`s & `Edge`s from their space on the DB to keep up with memory usage.
- Introduce a GUUID generator.
- Create `findById` and `findIndexById` functions.
- Testing for all of the above
- Update READNE
- Update `devDependencies`

### Thu Jan 5 14:52:24 2017 -0600
- Commit: `b365d55c68fb83f6f42a676ba753b7aec83c3dcb`
- Author: Tom Bremer ([tom@tbremer.com](tom@tbremer.com))
- Version: 1.4.2

#### Changes
- Update Giraffe methods so that Arrays are mutated instead of creating new.
- Allow `Graffe.create` to take arrays of labels.
- Tests where appropriate.

### Thu Jan 5 01:16:07 2017 -0600
- Commit: `1bb3ec4808bea50b01a8ecfb8db2ed2c98d8cbcb`
- Author: Tom Bremer ([tom@tbremer.com](tom@tbremer.com))
- Version: 1.4.1

#### Changes
- Add `Array.from` polyfill for browsers that do not support it.

### Thu Jan 5 00:51:59 2017 -0600
- Commit: `b8ef6a2a58931916df75951c1d2fcc69b0e95d89`
- Author: Tom Bremer ([tom@tbremer.com](tom@tbremer.com))
- Version: 1.4.0

#### Changes
- allow for callback in DB `new Giraffe(callback)`.
- create buildEdges for quick edge calculation
  - this takes edges and binds all of it's nodes blindly.
  - add tests
- move `db.update` higher in index
- add conditional callback calling in all db methods
- Add babel transform rest-spread for making unit tests easier to write.
  - _does not affect bundle_

### Wed Jan 4 13:29:17 2017 -0600
- Commit: `93748aa95fe81ef6435b3ab839a5202ee28f25c5`
- Author: Tom Bremer ([tom@tbremer.com](tom@tbremer.com))
- Version: 1.3.0

#### Changes:
- Remove `Obj` creator

### Wed Jan 4 12:58:32 2017 -0600
- Commit: `1e5ef48025c32588fd183ab7274b231d245bb460`
- Author: Tom Bremer ([tom@tbremer.com](tom@tbremer.com))
- Version: 1.2.0

#### Changes:
- Add ability to pass data into the DB Creator
- Move lib.js to it's own folder
- Add tests around lib
- Change how `properties` get set in `db.create` and `db.edge`

### Tue Jan 3 12:50:55 2017 -0600
- Commit: `b0d761352551c95738f0690052283c7de1051276`
- Author: Tom Bremer ([tom@tbremer.com](tom@tbremer.com))
- Version: 1.1.0

#### Changes:
- Initial Push and NPM Publish
