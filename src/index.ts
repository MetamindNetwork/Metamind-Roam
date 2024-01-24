import PageGenerationWidget from "./components/PageGenerationWidget";
import GraphPublishingWidget from "./components/GraphPublishingWidget";
import GraphSyncWidget from "./components/GraphSyncWidget";
import EmptyComponent from "./components/EmptyComponent";
import { generatePages } from "./utils";

export default {
  onload: ({ extensionAPI }: { extensionAPI: any }) => {
    const config = {
      tabTitle: "Metamind Roam",
      settings: [
        {
          id: "graphgator-setup",
          name: "SETUP AND INSTALL",
          description:
            "Generate a New API Token from the Graph Tab. Copy and Paste it here, and save it somewhere safely. \
            You can now sync the graph to our servers and go back to doing your work on the graph. From now on, \
            whenever you want to track your work, come back here and follow the first 3 steps above.",
          action: {
            type: "reactComponent",
            component: GraphPublishingWidget(extensionAPI),
          },
        },
        {
          id: "graphgator-generate",
          name: "STEP 1/3 : Generate Graph Update Log since Last Sync",
          description:
            "For our V1, Update Log is New, Modified and Renamed Pages since last Sync.",
          action: {
            type: "reactComponent",
            component: PageGenerationWidget(extensionAPI),
          },
        },
        {
          id: "graphgator-sync",
          name: "STEP 2/3 : Check out the New Pages. ",
          description:
            "Review, Edit and Annotate Update Log, and Storify it for yourself and people you share your Graph with. \
            You may also make modifications to your Graph's [[M/Index]]. \
            The latest Update Log is also found at the top of your [[M/Update Logs]] page.",
          action: {
            type: "reactComponent",
            component: EmptyComponent(),
          },
        },
        {
          id: "graphgator-sync",
          name: "STEP 3/3 : Save the current Graph State",
          description:
            "Done with your Update Log and Index page. Finally, save the graph in it's current state. \
            And go back to doing your work until next time.",
          action: {
            type: "reactComponent",
            component: GraphSyncWidget(extensionAPI),
          },
        },
      ],
    };
    extensionAPI.settings.panel.create(config);

    const addMetamindRoamButton = () => {

      // Publish button for the topbar
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
        window.roamAlphaAPI.ui.rightSidebar.close()
        window.roamAlphaAPI.ui.mainWindow.openDailyNotes();
      });

      // M/Review Button for the topbar
      const mReviewButton = document.createElement("button");
      mReviewButton.id = "metamind-roam-review";
      mReviewButton.innerText = "M/Review";
      mReviewButton.className = "black-button";
      mReviewButton.addEventListener("click", async () => {
        const pageTitle = await generatePages(true);
        await window.roamAlphaAPI.ui.mainWindow.openPage({ page: { 'title': `${pageTitle}` } });
        let pageUID = await window.roamAlphaAPI.q(`[:find ?uid :where [?e :node/title "M/Graph Home"][?e :block/uid ?uid ] ]`);
        await window.roamAlphaAPI.ui.rightSidebar.addWindow({ window: { 'type': 'outline', 'block-uid': `${pageUID}` } });
        let reviewButtonById = document.getElementById("metamind-roam-review");
        mCancelButton.setAttribute("page-title", `${pageTitle}`);
        mCancelButton.setAttribute("home-block-uid", "" );
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
      mPublishButton.addEventListener("click", async () => {
        console.log("clicked");
      });
      mPublishButton.disabled = true;

      const graphDiv = document.createElement("div");
      graphDiv.id = "metamind-roam-topbar";
      graphDiv.innerText = "Graph Updates";
      graphDiv.appendChild(mReviewButton);
      graphDiv.appendChild(mSaveButton);
      graphDiv.appendChild(mPublishButton);


      if (document.querySelector(".rm-open-left-sidebar-btn")) {
        // the sidebar is closed
        if (document.querySelector("#todayTomorrow")) {
          // Yesterday Tomorrow extension also installed, so place this to right
          let todayTomorrow = document.querySelector("#todayTomorrow");
          todayTomorrow.after(graphDiv);
        } else if (
          document.querySelector(
            "span.bp3-button.bp3-minimal.bp3-icon-arrow-right.pointer.bp3-small.rm-electron-nav-forward-btn"
          )
        ) {
          // electron client needs separate css
          let electronArrows = document.getElementsByClassName(
            "rm-electron-nav-forward-btn"
          )[0];
          electronArrows.after(graphDiv);
        } else {
          let sidebarButton = document.querySelector(
            ".rm-open-left-sidebar-btn"
          );
          sidebarButton.after(graphDiv);
        }
      } else {
        if (document.querySelector("#todayTomorrow")) {
          // Yesterday Tomorrow extension also installed, so place this to right
          let todayTomorrow = document.querySelector("#todayTomorrow");
          todayTomorrow.after(graphDiv);
        } else if (
          document.querySelector(
            "span.bp3-button.bp3-minimal.bp3-icon-arrow-right.pointer.bp3-small.rm-electron-nav-forward-btn"
          )
        ) {
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
    };
    addMetamindRoamButton();
  },
};
