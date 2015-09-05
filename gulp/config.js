var sourceDir = './src'
var outputDir = './public'

module.exports = {
    publicAssets: outputDir,
    browserSync: {
        proxy: 'localhost:8080'
    },
    templates: {
        src: sourceDir + '/templates/*.html',
        dest: outputDir
    },
    sass: {
        src: sourceDir + '/stylesheets/**/*.scss',
        dest: outputDir + '/assets/stylesheets',
        settings: {
            outputStyle: 'compressed',
            imagePath: '/assets/images' // Used by the image-url helper
        }
    },
    images: {
        src: sourceDir + '/images/**',
        dest: outputDir + '/assets/images'
    }
}
