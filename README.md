## Requirements

You must need Node.js installed in the machine

### Getting started

#### Install dependencies

Just run this command to install the dependencies:
`npm install`

#### Start server

Just run this command to compile files, get PageSpeed Insights score and put server online:
`npm run online`

#### Get PageSpeed Insights

Just run this command:
`npm start`

### Changes

#### Portifolio project

* Created a gulp to handle with all stuff
* HTML minified
* JS minified and uglified
* CSS minified
* Fixed the render blocking issue
* Images optimized
* Images converted to webp
* Used picture element to handle with webp and traditional images

#### Pizza project

* Now declaring variables in the loop declaration
* Reorder the declaration of several variables to save memory and prevent layout
* Changed the way the scroll event works, debouncing it
* Updated updatePositions method to use requestAnimationFrame
* Changed the way that pizzas are generated, reducing the number of pizzas
* Changed the way the pizzas move, now using transform to 3d acceleration
* Added `will-change` and `transform` in the `.mover` class in the CSS
* Put capitalization into CSS instead JS