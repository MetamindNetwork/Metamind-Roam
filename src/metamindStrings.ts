export const updateLogPageTitle = 'M/Update Logs';
export const homeGraphPageTitle = 'M/Graph Home';

export const homeGraphPageMentions = (pageTitle: string) => {
    return `**All New Mentions within [[${pageTitle}]]**`
}

export const updateLogPageMentions = (pageTitle: string) => {
    const blockText = `[[${pageTitle}]]\n**Title** :\n**Date** : [[${window.roamAlphaAPI.util.dateToPageTitle(new Date())}]]`;
    return blockText;
}

export const getRoamDateFormat = (date: Date) => {
    return window.roamAlphaAPI.util.dateToPageTitle(date);
}

export const getUpdateLogInfo = `**How to make use of Update Log info :**

    1. **Review** the update log to think of new tasks, do consolidation of your content-graph using [[M/Graph Home]] page, plan your work, etc.
    2. [Storify the Update Log](https://metamindco.substack.com/i/140281685/the-v-plugin-generates-this) to share with your team-mates or future-you. **Prefix the pages you want them to necessarily checkout with the To-Do Checkbox, like this : ✅ [[ Page Name]].**

    **Note :**

    1. 📱This can also be used for consumption by private or public followers on Metamind Mobile App. : [Sign up to be onboarded in a Day.](https://metamindco.substack.com/i/140281685/and-one-more-thing-graph-based-publishing-is-coming) Also, for this, please share your Graph API Token in the plugin page now.

    2. [We](https://www.metamind.network) want to eventually [automate this entire workflow](https://x.com/vgr/status/1541463788058161154) for you. Share Graph API Token in the plugin page for the same.  [Feature request & suggestions here: Discord/Metamind](https://discord.gg/mnYRZPV8sH)

    **Hit “Save” in the top-bar when you're done with both Pages.**`

export const getGraphHomeInfo = `**How to build your Graph Home :**

1. **Build and Manage your Graph Wiki easily with every Update Log.**
	a. Table of Contents: Nest page-tags into their hierarchical relationship.
	b. Squash all redundant tags.
	c. Record informative comments for the pages.
2. **Use Graph Home to Storify all the key jump-points or regions for your graph.**

**Note :**

1. 📱This can also be used for consumption by private or public followers on Metamind Mobile App. : [Sign up to be onboarded in a Day.](https://metamindco.substack.com/i/140281685/and-one-more-thing-graph-based-publishing-is-coming) Also, for this, please share your Graph API Token in the plugin page now.

2. [We](https://www.metamind.network) want to eventually [automate this entire workflow](https://x.com/vgr/status/1541463788058161154) for you. Share Graph API Token in the plugin page for the same.  [Feature request & suggestions here: Discord/Metamind](https://discord.gg/mnYRZPV8sH)

**Hit “Save” in the top-bar when you're done with both Pages.**
`
