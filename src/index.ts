import runExtension from "roamjs-components/util/runExtension";
import PageGenerationWidget from "./components/PageGenerationWidget";
import GraphPublishingWidget from "./components/GraphPublishingWidget";
import GraphSyncWidget from "./components/GraphSyncWidget";
import EmptyComponent from "./components/EmptyComponent";

export default runExtension({
  run: (args) => {
    args.extensionAPI.settings.panel.create({
      tabTitle: "Metamind Roam",
      settings: [
        {
          id: "graphgator-setup",
          name: "SETUP AND INSTALL",
          description: "Generate a New API Token from the Graph Tab. Copy and Paste it here, and save it somewhere safely. \
          You can now sync the graph to our servers and go back to doing your work on the graph. From now on, \
          whenever you want to track your work, come back here and follow the first 3 steps above.",
          action: {
            type: "reactComponent",
            component: GraphPublishingWidget(args.extensionAPI)
          }
        },
        {
          id: "graphgator-generate",
          name: "STEP 1/3 : Generate Graph Update Log since Last Sync",
          description: "For our V1, Update Log is New, Modified and Renamed Pages since last Sync.",
          action: {
            type: "reactComponent",
            component: PageGenerationWidget(args.extensionAPI)
          }
        },
        {
          id: "graphgator-sync",
          name: "STEP 2/3 : Check out the New Pages. ",
          description: "Review, Edit and Annotate Update Log, and Storify it for yourself and people you share your Graph with. \
          You may also make modifications to your Graph's [[M/Index]]. \
          The latest Update Log is also found at the top of your [[M/Update Logs]] page.",
          action: {
            type: "reactComponent",
            component: EmptyComponent()
          }
        },
        {
          id: "graphgator-sync",
          name: "STEP 3/3 : Save the current Graph State",
          description: "Done with your Update Log and Index page. Finally, save the graph in it’s current state. \
          And go back to doing your work until next time.",
          action: {
            type: "reactComponent",
            component: GraphSyncWidget(args.extensionAPI)
          }
        },
      ]
    });
  }
});
