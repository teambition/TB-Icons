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
```
Writing...
```

### TODO
- Create an SVG symbol sprite from icon fonts.

### License
This work is licensed under the MIT license.
