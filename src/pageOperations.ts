import _ from "lodash";
import getPageUidByPageTitle from "roamjs-components/queries/getPageUidByPageTitle";
import getBasicTreeByParentUid from "roamjs-components/queries/getBasicTreeByParentUid";
import getBlockUidByTextOnPage from "roamjs-components/queries/getBlockUidByTextOnPage";
import { createPage, createBlock, deleteBlock } from "roamjs-components/writes";
import renderToast from "roamjs-components/components/Toast";
import {
  getRenamedPage,
  getRecentEditedPages,
  getModifiedPage,
  getDateFilteredPages,
  convertToMilisecond,
  getDatePages,
} from "./utils";
import { getRoamDateFormat, homeGraphPageMentions, homeGraphPageTitle, updateLogPageMentions, updateLogPageTitle } from "./metamindStrings";

export const createIndexPage = (
  newPages: Array<string>,
  datePages: Array<string>,
  pageTitle: string
) => {
  const indexPageName = homeGraphPageTitle;
  let allPages = [...newPages, ...datePages]; //getRecentEditedPages();
  allPages = _.without(allPages, indexPageName);
  let blockTitle = homeGraphPageMentions(pageTitle);

  Promise.all([createPage({ title: indexPageName })])
    .then((data) => {
      const pageUide = data[0];
      createBlock({
        node: { text: `**${blockTitle}**`, heading: 2 },
        parentUid: pageUide,
      }).then((data) => {
        const blockUid = data;
        allPages.forEach((ele, i) => {
          createBlock({
            node: { text: `[[${ele}]]` },
            parentUid: blockUid,
            order: i + 1,
          });
        });
      });
    })
    .catch((e) => {
      const pageUid = getPageUidByPageTitle(indexPageName);
      createBlock({
        node: { text: `${blockTitle}`, heading: 2 },
        parentUid: pageUid,
      }).then((data) => {
        const blockUid = data;
        allPages.forEach((ele, i) => {
          createBlock({
            node: { text: `[[${ele}]]` },
            parentUid: blockUid,
            order: i + 1,
          });
        });
      });
    });

  renderToast({
    content: "Generating the Graph Home page!",
    intent: "warning",
    id: "roam-js-graphgator-index-page",
  });
};

const createBlocks = (
  pageUid: string,
  renamedPage: any,
  modifiedPage: any,
  newPages: any,
  datePages: any,
  formattedDate: string
) => {
  // Renamed Pages
  Promise.all([
    createBlock({
      node: {
        text: `**Renamed Pages since** [[${formattedDate}]]`,
        heading: 2,
      },
      parentUid: pageUid,
      order: 1,
    }),
  ]).then((data) => {
    let blockUid = data[0];
    renamedPage.forEach((ele: string, index: number) => {
      createBlock({
        node: { text: `[[${ele}]]` },
        parentUid: blockUid,
        order: index + 1,
      });
    });
  });

  // Modified Pages
  Promise.all([
    createBlock({
      node: {
        text: `**Modified Pages since** [[${formattedDate}]]`,
        heading: 2,
      },
      parentUid: pageUid,
      order: 2,
    }),
  ]).then((data) => {
    let blockUid = data[0];
    modifiedPage.forEach((ele: string, index: number) => {
      createBlock({
        node: { text: `[[${ele}]]` },
        parentUid: blockUid,
        order: index + 1,
      });
    });
  });

  // New Pages
  Promise.all([
    createBlock({
      node: { text: `**New Pages since** [[${formattedDate}]]`, heading: 2 },
      parentUid: pageUid,
      order: 3,
    }),
  ]).then((data) => {
    let blockUid = data[0];
    newPages.forEach((ele: string, index: number) => {
      createBlock({
        node: { text: `[[${ele}]]` },
        parentUid: blockUid,
        order: index + 1,
      });
    });
  });

  // Date Pages
  Promise.all([
    createBlock({
      node: {
        text: `**Daily Page Entries since** [[${formattedDate}]]`,
        heading: 2,
      },
      parentUid: pageUid,
      order: 3,
    }),
  ]).then((data) => {
    let blockUid = data[0];
    datePages.forEach((ele: string, index: number) => {
      createBlock({
        node: { text: `[[${ele}]]` },
        parentUid: blockUid,
        order: index + 1,
      });
    });
  });
};

export const createUpdateLogPage = (
  lastRunSeconds: number,
  numberOfSync: number
) => {
  const pageTitle = `Update No. #${numberOfSync}`;
  let modifiedPages: any = [];
  let renamedPages: any = [];
  let lastRunMiliSeconds = lastRunSeconds * 1000;
  let date = convertToMilisecond(lastRunMiliSeconds);
  let formattedDate = getRoamDateFormat(date);
  let newPages = getDateFilteredPages(lastRunMiliSeconds);
  // TODO: Add more such pages to be removed.
  newPages = _.without(newPages, pageTitle, "Index Page");

  // Date pages
  let datePages = getDatePages(lastRunMiliSeconds);

  // If the last run is 1, then it means that the page is being created for the first time.
  // Hence, all pages are new pages.
  if (lastRunMiliSeconds !== 1) {
    // Order of the page changes to show.
    modifiedPages = getModifiedPage(lastRunMiliSeconds);
    renamedPages = getRenamedPage(lastRunMiliSeconds);

    // Making sure to remove the duplicated pages.
    modifiedPages = _.without(
      modifiedPages,
      pageTitle,
      "Index Page",
      ...newPages
    );
    renamedPages = _.without(
      renamedPages,
      pageTitle,
      "Index Page",
      ...modifiedPages,
      ...newPages
    );
  }

  Promise.all([createPage({ title: pageTitle })])
    .then((data) => {
      const pageUid = data[0];
      generateUpdateLogIndexPage(pageTitle, pageUid);
      createBlocks(
        pageUid,
        renamedPages,
        modifiedPages,
        newPages,
        datePages,
        formattedDate
      );
    })
    .catch((e) => {
      const pageUid = getPageUidByPageTitle(pageTitle);
      const indexBlocks = getBasicTreeByParentUid(pageUid);
      let deletedBlocks: Promise<string | number>[] = [];
      indexBlocks.forEach((block) => {
        deletedBlocks.push(deleteBlock(block.uid));
      });
      Promise.all(deletedBlocks).then((data) => {
        renderToast({
          content: `Regenerating the Update Log for ${pageTitle}`,
          intent: "warning",
          id: "roam-js-graphgator-log-page",
        });
        generateUpdateLogIndexPage(pageTitle, pageUid);
        createBlocks(
          pageUid,
          renamedPages,
          modifiedPages,
          newPages,
          datePages,
          formattedDate
        );
      });
    });
  return { pageTitle, newPages, renamedPages, modifiedPages, datePages };
};

export const generateUpdateLogIndexPage = (
  updatePageTitle: string,
  updateLogPageUid: string
) => {
  const pageTitle = updateLogPageTitle;
  const pageUid = getPageUidByPageTitle(pageTitle);
  if (pageUid === "") {
    Promise.all([createPage({ title: pageTitle })]).then((data) => {
      const pageUid = data[0];
      createUpdateLogBlock(
        updatePageTitle,
        pageTitle,
        pageUid,
        updateLogPageUid
      );
    });
  } else {
    createUpdateLogBlock(updatePageTitle, pageTitle, pageUid, updateLogPageUid);
  }
};

function createUpdateLogBlock(
  updatePageTitle: string,
  pageTitle: string,
  pageUid: string,
  updateLogPageUid: string
) {
  const blockText = updateLogPageMentions(updatePageTitle);
  const blockUid = getBlockUidByTextOnPage({
    text: blockText,
    title: pageTitle,
  });
  if (blockUid !== "") {
    Promise.all([deleteBlock(blockUid)]);
  }
  createBlock({ node: { text: blockText }, parentUid: pageUid }).then(
    (data) => {
      const blockUid = data;
      createBlock({
        node: { text: `{{[[embed]]: ((${blockUid}))}}` },
        parentUid: updateLogPageUid,
      });
    }
  );
}
