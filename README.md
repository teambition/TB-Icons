## TB-ICONS: Find & Copy Playing
A classified icons set that consists of a part of Material Design icons and some original icons by [TB-UI](https://www.github.com/teambition/tb-ui) team. Available in Icon Fonts and SVG Symbols.

![TB-Icons Logo](./images/tb-icons-screenshot.png)

### Installation
```
npm i tb-icons --save
```

### Font Icons Usage

Move the fonts with Gulp:
```
gulp.task('move-fonts', function () {
  gulp.src('node_modules/tb-icons/dist/fonts/**/*')
    .pipe(gulp.dest('static/fonts/'))
})
```

Include the style in Stylus:

```
@import 'tb-icons'
```

Get an icon in Jade:
```
span.icon.icon-t
```

Check out [the font icons page](http://teambition.github.io/TB-Icons/font-icons/) to see all font icons.

### SVG Symbols Usage
Inline combined SVG reference into body, then drop a `<use>` element snippet like this:

``` xml
<svg role="img" class="ss-t">
  <use xlink:href="#t"></use>
</svg>
```

Or directly link the external `svg-symbols` file:
``` xml
<svg role="img" class="ss-t">
  <use xlink:href="#{svg-path}/svg-symbols.svg#t"></use>
</svg>
```

All SVG symbols available on [the SVG symbols page](http://teambition.github.io/TB-Icons/svg-symbols/).

### Development
The source files can be found in the [`src`](src) directory.

While developing, you should use the command `gulp && gulp serve` to create a watcher and run a docs server with livereload.

Then, to update the icon fonts, SVG font, and the icon name-unicode pairs store, preview immediately on `localhost:8001`.

Lastly, commit your great works, release a new version, use `gulp deploy` to publish docs to GitHub Pages.

### License
This work is licensed under the MIT license.
