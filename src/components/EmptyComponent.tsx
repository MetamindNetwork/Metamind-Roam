import React from "react";

const EmptyComponent = () => () => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <img
          src="https://github.com/MetamindNetwork/metamind-roam/assets/7670449/d6fb5dfe-6e03-4819-9747-4f7a240bc642"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <br />
        <br />
        <ul>
          <li>
            <strong>
              After INSTALL, simply go back to doing your work on the graph.
              Then when you wish...
            </strong>
          </li>
          <li>
            <strong>
              STEP 1/3: Tap “Review” on the top bar to generate a new `update
              log` for the work you did since INSTALL or the last Saved State.
            </strong>{" "}
            For our V1, Update Log gives you New and Modified Pages with new
            Content and also, Daily Page Entries and Renamed Pages, since the
            last Saved State. You will also see all the new nodes mentioned in
            the update at the bottom of the [[M/Graph Home]] that you can
            structure accordingly in your Graph Home.{" "}
          </li>
          <br />
          <li>
            <strong>
              STEP 2/3: Go to the latest Update Log on the [[M/Update Logs]]
              page. Simultaneously, make changes to your [[M/Graph Home]] in the
              sidebar.
            </strong>
          </li>
          <br />
          <li>
            <strong>
              STEP 3/3: Tap “Save” on the top bar once you're done with both
              pages.** *Note: Everything happens locally. We only record the
              time-stamp for the last saved state to our servers. Enter the API
              Token below to allow yourself and your peers to privately or
              publicly access the graph through the Metamind App and make the
              plugin work much faster.
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyComponent;
