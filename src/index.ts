import MagicString from 'magic-string';
import { Node, walk } from 'svelte/compiler';
import { parseHtmlx } from './htmlxparser'


export interface SveltePreprocessorInput {
    content: string;
    file: string;
}
export interface SveltePreprocessorOutput {
    code: string;
    map: string;
}
export interface SveltePreprocessorDefinition {
    markup: (source: SveltePreprocessorInput) => SveltePreprocessorOutput;
}

function isWhiteSpace(char: string) {
    return char == ' ' || char == '\n' || char == '\t' || char == '\r';
}

function insertAttributeToElement(element: Node, attributeString: string, src: string, dest: MagicString) {
    let insertIdx = src.indexOf(element.name, element.start) + element.name.length;
    let insertStr = ` ${attributeString}` + (isWhiteSpace(src[insertIdx]) ? '' : ' ');
    dest.appendRight(insertIdx, insertStr);
}

export default function preprocess() {
    return {
        markup: function (source: SveltePreprocessorInput): SveltePreprocessorOutput {
            //input
            var out = new MagicString(source.content);
            var src = source.content;

            var processedExistingOptionsAttribute = false;

            const addXmlNamespaceToSvelteOptions = (node: Node) => {
                if (node.type != 'Options') return;
                processedExistingOptionsAttribute = true;
                let namespaceAttr = node.attributes.find((attr: any) => attr.name == 'namespace');
                if (!namespaceAttr) {
                    insertAttributeToElement(node, 'namespace="foreign"', src, out)
                }
            };
            
            const appendOptionWithNamespace = () => {
                out.prepend('<svelte:options namespace="foreign"/>')
            }
            
            //apply transforms
            try {
                var ast = parseHtmlx(source.content);
            } catch (e) {
                //convert svelte CompilerError to string for our loader (rollup/webpack)
                var error = new Error(`${source.file ? `${source.file} :` : ""}${e.toString()}`);
                error.name = `SvelteNativePreprocessor/${e.name}`
                throw error;
            }
           
            walk(ast, { 
                enter: (node: Node, parent: Node, prop: string, index: number) => {
                    addXmlNamespaceToSvelteOptions(node);
                }
            })
  
            if (!processedExistingOptionsAttribute) {
                appendOptionWithNamespace();
            }

            //output
            var map = out.generateMap({
                source: source.file,
                file: source.file + ".map",
                includeContent: true
            });
            return { code: out.toString(), map: map.toString() };
        }
    }
}