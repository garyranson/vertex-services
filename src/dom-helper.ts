export class DomHelper {
  normalise<T extends Node>(dom: T): T {
    getCommentsAndEmptyTextNodes(dom).forEach((node) => {
      node.parentElement.removeChild(node);
    });
    return dom;
  }
}

function getCommentsAndEmptyTextNodes(node: Node): Node[] {
  const tw     = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_TEXT);
  const remove = [];
  while (tw.nextNode()) {
    if (tw.currentNode.nodeType !== 3 || /^\s*$/.test(tw.currentNode.nodeValue) === true) {
      remove.push(tw.currentNode);
    }
  }
  return remove;
}