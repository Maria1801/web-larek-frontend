export function copyTemplate(id: string): HTMLElement {
    const template = document.getElementById(id) as HTMLTemplateElement;
    return template.content.firstElementChild.cloneNode(true) as HTMLElement;
}