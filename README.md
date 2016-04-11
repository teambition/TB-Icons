## TB-ICONS: Find & Copy Playing
A classified icons set that consists of a part of Material Design icons and some original icons by [TB-UI](https://www.github.com/teambition/tb-ui) team. Available in Icon Font and SVG.

![TB-Icons Logo](./images/tb-icons-screenshot.png)

### Installation
```
npm i tb-icons --save
```

### Usage

Include the style in Stylus:

```
@import 'tb-icons/dist/font-icons'
```

Get an icon in Jade:
```
span.icon.icon-t
```

Move the fonts with Gulp:
```
gulp.task('move-fonts', function () {
  gulp.src('node_modules/tb-icons/dist/fonts/**/*')
    .pipe(gulp.dest('static/fonts/'))
})
```

### Development
The source files can be found in [`src`](src) directory.

While developing, you should use the command `gulp && gulp serve` to create a watcher and run a docs server with livereload.

Then, to update the icon fonts and icon name-unicode pairs store, preview immediately on `localhost:8001`.

Lastly, commit your great works, release a new version, use `gulp deploy` to publish docs to GitHub pages.

### TODO
- Create an SVG symbol sprite from icon fonts.

### License
This work is licensed under the MIT license.
