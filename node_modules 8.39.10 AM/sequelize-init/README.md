# [Sequelize](https://github.com/sequelize/sequelize)-init

> Import Sequelize models with ease.

## Setup

Create `index.js` inside your `models` folder.

```js
import Sequelize from 'sequelize';
import init from 'sequelize-init'

let sequelize = new Sequelize('database', 'username', 'password');
let db = init(sequelize, __dirname, {exclude: ['index.js']});

export default db;
```
