import { generatePages, postGraph } from "./utils";
import getBlockUidByTextOnPage from "roamjs-components/queries/getBlockUidByTextOnPage";
import {
  homeGraphPageMentions,
  homeGraphPageTitle,
  updateLogPageMentions,
  updateLogPageTitle
} from "./metamindStrings";

export function metamindToolBar() {
  const mCancelButton = document.createElement("button");
  mCancelButton.id = "metamind-roam-cancel";
  mCancelButton.innerText = "Cancel";
  mCancelButton.className = "light-button";
  mCancelButton.addEventListener("click", async () => {
    let cancelButtonById = document.getElementById("metamind-roam-cancel");
    cancelButtonById.replaceWith(mReviewButton);
    let saveButtonById = document.getElementById("metamind-roam-save");
    saveButtonById.className = "light-button";
    saveButtonById.setAttribute("disabled", "");
    let pageTitle = mCancelButton.getAttribute("page-title");
    // Delete the block first and then the page
    await deleteBlockPages(pageTitle);
  });

  // M/Review Button for the topbar
  const mReviewButton = document.createElement("button");
  mReviewButton.id = "metamind-roam-review";
  mReviewButton.innerText = "M/Review";
  mReviewButton.className = "black-button";
  mReviewButton.addEventListener("click", async () => {
    const pageTitle = await openRelatedPagesInPane();
    let reviewButtonById = document.getElementById("metamind-roam-review");
    mCancelButton.setAttribute("page-title", `${pageTitle}`);
    reviewButtonById.replaceWith(mCancelButton);
    let saveButtonById = document.getElementById("metamind-roam-save");
    saveButtonById.className = "black-button";
    saveButtonById.removeAttribute("disabled");
  });

  // Save button for the topbar
  const mSaveButton = document.createElement("button");
  mSaveButton.id = "metamind-roam-save";
  mSaveButton.innerText = "Save";
  mSaveButton.className = "light-button";
  mSaveButton.addEventListener("click", async () => {
    await postGraph("", "");
    let cancelButtonById = document.getElementById("metamind-roam-cancel");
    cancelButtonById.replaceWith(mReviewButton);
    let saveButtonById = document.getElementById("metamind-roam-save");
    saveButtonById.className = "light-button";
    saveButtonById.setAttribute("disabled", "");
  });
  mSaveButton.disabled = true;

  // Publish button for the topbar
  const mPublishButton = document.createElement("button");
  mPublishButton.id = "metamind-roam-publish";
  mPublishButton.innerText = "Publish";
  mPublishButton.className = "light-button";
  mPublishButton.addEventListener("click", async () => { });
  mPublishButton.disabled = true;

  const graphDiv = document.createElement("div");
  graphDiv.id = "metamind-roam-topbar";
  graphDiv.innerText = "Graph Updates";
  graphDiv.appendChild(mReviewButton);
  graphDiv.appendChild(mSaveButton);
  graphDiv.appendChild(mPublishButton);
  return graphDiv;
}
export function checkToAddToolBar(graphDiv: HTMLDivElement) {
  /**
   * Direct inspiration and the usage of toolbar is taken from github.com/mlava/workspaces
   */
  if (document.querySelector(".rm-open-left-sidebar-btn")) {
    // the sidebar is closed
    if (document.querySelector("#todayTomorrow")) {
      // Yesterday Tomorrow extension also installed, so place this to right
      let todayTomorrow = document.querySelector("#todayTomorrow");
      todayTomorrow.after(graphDiv);
    } else if (document.querySelector(
      "span.bp3-button.bp3-minimal.bp3-icon-arrow-right.pointer.bp3-small.rm-electron-nav-forward-btn"
    )) {
      // electron client needs separate css
      let electronArrows = document.getElementsByClassName(
        "rm-electron-nav-forward-btn"
      )[0];
      electronArrows.after(graphDiv);
    } else {
      let sidebarButton = document.querySelector(".rm-open-left-sidebar-btn");
      sidebarButton.after(graphDiv);
    }
  } else {
    if (document.querySelector("#todayTomorrow")) {
      // Yesterday Tomorrow extension also installed, so place this to right
      let todayTomorrow = document.querySelector("#todayTomorrow");
      todayTomorrow.after(graphDiv);
    } else if (document.querySelector(
      "span.bp3-button.bp3-minimal.bp3-icon-arrow-right.pointer.bp3-small.rm-electron-nav-forward-btn"
    )) {
      // electron client needs separate css
      let electronArrows = document.getElementsByClassName(
        "rm-electron-nav-forward-btn"
      )[0];
      electronArrows.after(graphDiv);
    } else {
      var topBarContent = document.querySelector(
        "#app > div > div > div.flex-h-box > div.roam-main > div.rm-files-dropzone > div"
      );
      var topBarRow = topBarContent.childNodes[1];
      topBarRow.parentNode.insertBefore(graphDiv, topBarRow);
    }
  }
}

async function openRelatedPagesInPane() {
  const pageTitle = await generatePages();
  await window.roamAlphaAPI.ui.mainWindow.openPage({
    page: { title: `${pageTitle}` },
  });
  let pageUID = await window.roamAlphaAPI.q(
    `[:find ?uid :where [?e :node/title "M/Graph Home"][?e :block/uid ?uid ] ]`
  );
  await window.roamAlphaAPI.ui.rightSidebar.addWindow({
    window: { type: "outline", "block-uid": `${pageUID}` },
  });
  return pageTitle;
}

async function deleteBlockPages(pageTitle: string) {
  const blockText = updateLogPageMentions(pageTitle);
  let updateLogBlockUid = getBlockUidByTextOnPage({
    text: blockText,
    title: updateLogPageTitle,
  });
  await window.roamAlphaAPI.deleteBlock({
    block: { uid: `${updateLogBlockUid}` },
  });
  let homeGraphblockUid = getBlockUidByTextOnPage({
    text: homeGraphPageMentions(pageTitle),
    title: homeGraphPageTitle,
  });
  await window.roamAlphaAPI.deleteBlock({
    block: { uid: `${homeGraphblockUid}` },
  });
  let pageUID = await window.roamAlphaAPI.q(
    `[:find ?uid :where [?e :node/title "${pageTitle}"][?e :block/uid ?uid ] ]`
  );
  await window.roamAlphaAPI.deletePage({ page: { uid: `${pageUID}` } });
  window.roamAlphaAPI.ui.rightSidebar.close();
  window.roamAlphaAPI.ui.mainWindow.openDailyNotes();
}
