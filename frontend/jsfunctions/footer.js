export {renderFooter};
import {getSnippet, renderSnippet} from "./functions.js";

var footerContainer = document.getElementById("footerContainer");

function renderFooter(){
    getSnippet("../../snippets_html/snippetFooter.html").then((snippet) => renderSnippet(snippet, footerContainer));
}