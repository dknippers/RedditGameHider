const feedModifyFns = [];

(function modifyFeed() {
  // Element may not exist at initial load
  const feedObserver = new MutationObserver(() => {
    if (observeFeed()) {
      feedObserver.disconnect();
    }
  });

  feedObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  function observeFeed() {
    const feedContainer = document.getElementById("subgrid-container");
    if (!feedContainer) return false;

    const observer = new MutationObserver(() => {
      for (const fn of feedModifyFns) {
        if (typeof fn === "function") {
          fn(feedContainer);
        }
      }
    });

    observer.observe(feedContainer, {
      childList: true,
      subtree: true
    });

    return true;
  }
})();

function removeGamesFromFeed(feedContainer) {
  // There are "Apps" and "Games", we want to remove both they are very similar.
  const gamePosts = feedContainer.querySelectorAll("shreddit-post:is([app-name],[game])");
  for (const gamePost of gamePosts) {
    const title = gamePost.getAttribute("post-title") ?? "GAME_TITLE_NOT_FOUND";
    gamePost.remove();
    console.log(`[Reddit Feed Cleaner] Removed game post "${title}"`);
  }
}

feedModifyFns.push(removeGamesFromFeed);
