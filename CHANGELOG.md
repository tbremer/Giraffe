Changelog
----

### Thu Jan 5 01:16:07 2017 -0600
- Commit: 1bb3ec4808bea50b01a8ecfb8db2ed2c98d8cbcb
- Author: Tom Bremer <tom@tbremer.com>
- Version: 1.4.1

#### Changes
- Add `Array.from` polyfill for browsers that do not support it.

### Thu Jan 5 00:51:59 2017 -0600
- Commit: b8ef6a2a58931916df75951c1d2fcc69b0e95d89
- Author: Tom Bremer <tom@tbremer.com>
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
- Commit: 93748aa95fe81ef6435b3ab839a5202ee28f25c5
- Author: Tom Bremer <tom@tbremer.com>
- Version: 1.3.0

#### Changes:
- Remove `Obj` creator

### Wed Jan 4 12:58:32 2017 -0600
- Commit: 1e5ef48025c32588fd183ab7274b231d245bb460
- Author: Tom Bremer <tom@tbremer.com>
- Version: 1.2.0

#### Changes:
- Add ability to pass data into the DB Creator
- Move lib.js to it's own folder
- Add tests around lib
- Change how `properties` get set in `db.create` and `db.edge`

### Tue Jan 3 12:50:55 2017 -0600
- Commit: `b0d761352551c95738f0690052283c7de1051276`
- Author: Tom Bremer <tom@tbremer.com>
- Version: 1.1.0

#### Changes:
- Initial Push and NPM Publish
