export const updateLogPageTitle = 'M/Update Logs';
export const homeGraphPageTitle = 'M/Graph Home';

export const homeGraphPageMentions = (pageTitle: string) => {
    return `**All New Mentions within [[${pageTitle}]]**`
}

export const updateLogPageMentions = (pageTitle: string) => {
    const blockText = `[[${pageTitle}]]\n**Title** :\n**Date** : [[${window.roamAlphaAPI.util.dateToPageTitle(new Date())}]]`;
    return blockText;
}
