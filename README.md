# robotka.robotickytabor.cz

[![Build Status](https://travis-ci.org/RoboticsBrno/robotka.robotickytabor.cz.svg?branch=master)](https://travis-ci.org/RoboticsBrno/robotka.robotickytabor.cz)

Web for robotic camp 2020: [robotka.robotickytabor.cz](http://robotka.robotickytabor.cz)

## Installation

You'll need [Ruby+devkit](https://rubyinstaller.org/downloads/) (v2.5.5-1) in the middle of installation choose option `1` and  [GraphicsMagick](ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/windows/) `ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/windows/` (v1.3.31-Q16) installed.

Then install Jekyll by opening Ruby terminal from start menu with command ```gem install jekyll bundler```

Clone this repository and open into its folder Ruby terminal and run ```bundle install``` and then ```bundle exec jekyll serve```

## Format code

This is format for writing guide. 
```
{% include image.html
   url="img/..."
   description=
      ""
   url2="img/..."
   description2=
      ""
%} 
```
If you want 2 images abreast, use url2 and description2. Otherwise use only url and description.

## Images
Take widescreen photos not portrait.  
**Only if you are inserting new images:**  
Firstly insert new images to `img/guides/original` then turn on local server, which resize them. Take these resized images from `_site/img/guides` and drop them to the first mentioned destination. 

## License

The theme is available as so I use this source [MIT License][2].

[Materialize][3] a  modern responsive front-end framework based on Material Design

Copyright © 2017 Marco Damiani. Powered by <a href="http://jekyllrb.com">Jekyll</a>

[1]: https://github.com/jekyll/minima
[2]: https://opensource.org/licenses/MIT
[3]: http://materializecss.com/
.
