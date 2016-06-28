# TB Icons

A classified icons set that consists of a part of Material Design icons and some original icons by [TB-UI](https://www.github.com/teambition/tb-ui) team. Available in Icon Fonts and SVG Symbols.

You can check out all [iconfonts](http://teambition.github.io/TB-Icons/v2/iconfonts/) or all [SVG symbols](http://teambition.github.io/TB-Icons/v2/svgs/)


### Updates

Now the package has updated to version 0.2.0, if you are looking for the old version, checkout [v1](https://github.com/teambition/TB-Icons/tree/v1) branch or open [gh-pages/v1](http://teambition.github.io/TB-Icons/v1).


### Installation

```
npm install tb-icons
```


### Import

* Webpack

  Make sure install `url-loader`, `file-loader` to resolve iconfonts files or svg files, and install target `*-loader` to import icon stylesheets, like `stylus-loader`, `less-loader`, etc.

* LESS

  ```
  @import (css) "path/to/tb-icons/lib/tb-icons.less";
  ```

* Stylus

  ```
  @import 'path/to/tb-icons/lib/tb-icons.styl'
  ```

* Gulp

  Move the fonts with Gulp

  ```
  gulp.task('move-fonts', function () {
    gulp.src('node_modules/tb-icons/lib/fonts/**/*')
      .pipe(gulp.dest('path/to/fonts/'))
  })
  ```


### Usage

* Class Name

  Ensure you've import relative stylesheets, and use it within existed icons

  ```
  <span class="icon icon-{Icon Name}"></span>
  ```

* SVG Symbols

  Inline combined SVG reference into body, then drop a `<use>` element snippet

  ```
  <svg role="img">
    <use xlink:href="#{Icon Name}></use>
  </svg>
  ```

  Or directly link the external `svg-symbols` file:

  ```
  <svg role="img">
    <use xlink:href="{Url}/svg-symbols.svg#{Icon Name}"></use>
  </svg>
  ```


### Development

New version of TB-Icons required a valid `Sketch` file to generate all resources, please make sure you have rights to create more assets, or you can ask designers to distribute that.

All build process can be found in `gulpfile.babel.js` and local development is required for `webpack`.


### License
[MIT](https://opensource.org/licenses/MIT)
