# Svelte NodeGUI Preprocessor

A preprocessor for [Svelte NodeGUI](https://github.com/nodegui/svelte-nodegui); forked from [halfnelson](https://github.com/halfnelson)'s [svelte-native-preprocessor](https://github.com/halfnelson/svelte-native-preprocessor) for [Svelte Native](https://github.com/halfnelson/svelte-native).

It performs the following transforms to provide a better developer experience when using Svelte NodeGUI:

 - [x] Adds `<svelte:options namespace="foreign" />` to the component, ensuring the generated code is compatible with Svelte NodeGUI
 

## Installation

Using `svelte-loader`, in `webpack.config.js`:

```js
const SvelteNodeGUIPreprocessor = require("@nodegui/svelte-nodegui-preprocessor");
```

Where the `svelte-loader` is registered, add the preprocessor to `options.preprocess`:

```js
 {
    test: /\.svelte$/,
    exclude: /node_modules/,
    use: [
        { 
            loader: 'svelte-loader',
            options: {
                preprocess: SvelteNodeGUIPreprocessor()
            }
        }
    ]
},
```

There is a similar process for `rollup-plugin-svelte`, but users of that library are usually skilled enough to work it out ;)


## License

[MIT](LICENSE).
