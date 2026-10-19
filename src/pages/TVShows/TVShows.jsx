import React from "react";
import Banner from "../../components/Banner/Banner";
import DisplayRow from "../../components/DisplayRow/DisplayRow";

function TVShows({ onPlayMovie, onMoreInfo, onOpenAIExplanation }) {
  return (
    <main style={{ paddingTop: "20px" }}>
      <Banner onPlayMovie={onPlayMovie} onMoreInfo={onMoreInfo} />
      <DisplayRow
        onPlayMovie={onPlayMovie}
        onMoreInfo={onMoreInfo}
        onOpenAIExplanation={onOpenAIExplanation}
      />
    </main>
  );
}

export default TVShows;
