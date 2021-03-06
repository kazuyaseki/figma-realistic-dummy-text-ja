import { dummyData, optionGroups } from "./dummyData";

figma.showUI(__html__, { height: 320 });

const textNodes: TextNode[] = []

function traverseNodes(parentNode: SceneNode) {
  if (parentNode.type === "TEXT") {
    textNodes.push(parentNode)
  } else if ("children" in parentNode) {
    for (const child of parentNode.children) {
      if (
        child.type === "GROUP" ||
        child.type === "FRAME" ||
        child.type === "INSTANCE" ||
        child.type === "COMPONENT" ||
        child.type === "TEXT"
      ) {
        traverseNodes(child)
      }
    }
  }
}

function clearTextNodes() {
  textNodes.length = 0
}

function traverseSelection() {
  const selection = figma.currentPage.selection
  for (const selectedNode of selection) {
    traverseNodes(selectedNode)
  }
}

function replaceText(key: string) {
  if (textNodes.length) {
    for (const textNode of textNodes) {
      figma.loadFontAsync(textNode.fontName as FontName).then(() => {
        textNode.characters = dummyData[key]()
      })
    }
  } else {
    figma.notify("テキストの要素を選択してください")
  }
}

figma.ui.postMessage(optionGroups);

figma.ui.onmessage = msg => {
  if (msg.type === "run") {
    clearTextNodes()
    traverseSelection()
    replaceText(msg.data)
  }
};
