/*
  SHADOWVAULT PROJECT LIST
  ------------------------
  Replace a locked object with a project using the same fields as SCORN.

  Growth periods supported by DEX Screener:
  m5  = 5 minutes
  h1  = 1 hour
  h6  = 6 hours
  h24 = 24 hours
*/

const projects = [
  {
    name: "SCORN",
    ticker: "$SCORN",
    description:
      "The cutest red flag on Solana. No fake utility, no guaranteed profits, and no complicated roadmap—just corn, memes, and community chaos.",
    image: "scorn.jpg",
    contract: "BkBpR1JRsQM8EGrRrVBGftxdmvAYr1EBoqjnGPfApump",
    pumpUrl:
      "https://pump.fun/coin/BkBpR1JRsQM8EGrRrVBGftxdmvAYr1EBoqjnGPfApump",
    status: "LIVE",
    growthPeriod: "h24",
    locked: false
  },
  { locked: true },
  { locked: true },
  { locked: true },
  { locked: true },
  { locked: true }
];

const growthPeriodLabels = {
  m5: "5M",
  h1: "1H",
  h6: "6H",
  h24: "24H"
};

const projectGrid = document.querySelector("#project-grid");
const toast = document.querySelector("#toast");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("toast--visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 2200);
}

function createLockedCard(index) {
  return `
    <article class="project-card project-card--locked" aria-label="Future project ${index + 1}">
      <div class="project-media">
        <span class="project-status">PROJECT LOCKED</span>

        <div class="locked-media" aria-hidden="true">
          <div class="lock-icon">◇</div>
          <div class="locked-number">0${index + 1}</div>
        </div>
      </div>

      <div class="project-content">
        <div class="project-title-row">
          <h3 class="project-name">COMING SOON</h3>
          <span class="project-ticker">TBA</span>
        </div>

        <p class="project-description">
          A new project is waiting inside the Vault.
        </p>

        <div class="contract-box">
          <span class="contract-label">Contract Address</span>
          <span class="contract-value">Not available</span>
        </div>

        <div class="card-actions">
          <button class="card-button" type="button" disabled>
            CONTRACT PENDING
          </button>

          <button class="card-button" type="button" disabled>
            PROJECT LOCKED
          </button>
        </div>
      </div>
    </article>
  `;
}

function createProjectCard(project) {
  const hasContract =
    Boolean(project.contract) && project.contract !== "Coming Soon";

  const hasPumpUrl = Boolean(project.pumpUrl);
  const growthPeriod = project.growthPeriod || "h24";
  const growthLabel = growthPeriodLabels[growthPeriod] || "24H";

  const growthBadge = hasContract
    ? `
      <div
        class="growth-badge growth-badge--loading"
        data-token="${escapeHTML(project.contract)}"
        data-period="${escapeHTML(growthPeriod)}"
        title="Loading market data"
        aria-label="${escapeHTML(growthLabel)} price change loading"
      >
        <span class="growth-badge__period">${escapeHTML(growthLabel)}</span>
        <strong class="growth-badge__value">--</strong>
      </div>
    `
    : "";

  const copyButton = hasContract
    ? `
      <button
        class="card-button copy-contract"
        type="button"
        data-contract="${escapeHTML(project.contract)}"
      >
        COPY CONTRACT
      </button>
    `
    : `
      <button class="card-button" type="button" disabled>
        CONTRACT PENDING
      </button>
    `;

  const pumpButton = hasPumpUrl
    ? `
      <a
        class="card-button card-button--primary"
        href="${escapeHTML(project.pumpUrl)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        VIEW ON PUMP.FUN
      </a>
    `
    : `
      <span class="card-button card-button--primary" aria-disabled="true">
        PUMP.FUN SOON
      </span>
    `;

  return `
    <article class="project-card" aria-label="${escapeHTML(project.name)} project">
      <div class="project-media">
        <span class="project-status project-status--live">
          ${escapeHTML(project.status)}
        </span>

        ${growthBadge}

        <img
          src="${escapeHTML(project.image)}"
          alt="${escapeHTML(project.name)} meme coin logo"
          loading="eager"
        />
      </div>

      <div class="project-content">
        <div class="project-title-row">
          <h3 class="project-name">${escapeHTML(project.name)}</h3>
          <span class="project-ticker">${escapeHTML(project.ticker)}</span>
        </div>

        <p class="project-description">
          ${escapeHTML(project.description)}
        </p>

        <div class="contract-box">
          <span class="contract-label">Contract Address</span>
          <span
            class="contract-value"
            title="${escapeHTML(project.contract)}"
          >
            ${escapeHTML(project.contract)}
          </span>
        </div>

        <div class="card-actions">
          ${copyButton}
          ${pumpButton}
        </div>
      </div>
    </article>
  `;
}

function renderProjects() {
  if (!projectGrid) return;

  projectGrid.innerHTML = projects
    .map((project, index) =>
      project.locked
        ? createLockedCard(index)
        : createProjectCard(project)
    )
    .join("");
}

async function updateGrowthBadge(badge) {
  const tokenAddress = badge.dataset.token;
  const period = badge.dataset.period || "h24";
  const periodLabel = growthPeriodLabels[period] || "24H";
  const valueElement = badge.querySelector(".growth-badge__value");

  if (!tokenAddress || !valueElement) return;

  badge.classList.add("growth-badge--loading");
  valueElement.textContent = "--";

  try {
    const endpoint =
      `https://api.dexscreener.com/token-pairs/v1/solana/` +
      encodeURIComponent(tokenAddress);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`DEX Screener request failed: ${response.status}`);
    }

    const pairs = await response.json();

    if (!Array.isArray(pairs) || pairs.length === 0) {
      throw new Error("No indexed trading pairs found.");
    }

    const pairsWithTokenAsBase = pairs.filter(
      pair => pair?.baseToken?.address === tokenAddress
    );

    const candidatePairs =
      pairsWithTokenAsBase.length > 0 ? pairsWithTokenAsBase : pairs;

    const bestPair = [...candidatePairs].sort(
      (a, b) =>
        Number(b?.liquidity?.usd || 0) -
        Number(a?.liquidity?.usd || 0)
    )[0];

    const percentage = Number(bestPair?.priceChange?.[period]);

    if (!Number.isFinite(percentage)) {
      throw new Error("Price change is not available yet.");
    }

    const arrow = percentage > 0 ? "▲" : percentage < 0 ? "▼" : "•";
    const sign = percentage > 0 ? "+" : "";
    const formattedPercentage = `${arrow} ${sign}${percentage.toFixed(2)}%`;

    valueElement.textContent = formattedPercentage;

    badge.classList.remove(
      "growth-badge--loading",
      "growth-badge--positive",
      "growth-badge--negative",
      "growth-badge--neutral",
      "growth-badge--unavailable"
    );

    if (percentage > 0) {
      badge.classList.add("growth-badge--positive");
    } else if (percentage < 0) {
      badge.classList.add("growth-badge--negative");
    } else {
      badge.classList.add("growth-badge--neutral");
    }

    badge.title = `${periodLabel} price change: ${sign}${percentage.toFixed(2)}%`;
    badge.setAttribute(
      "aria-label",
      `${periodLabel} price change ${sign}${percentage.toFixed(2)} percent`
    );
  } catch (error) {
    console.warn("Unable to load SCORN market data:", error);

    valueElement.textContent = "N/A";

    badge.classList.remove(
      "growth-badge--loading",
      "growth-badge--positive",
      "growth-badge--negative",
      "growth-badge--neutral"
    );

    badge.classList.add("growth-badge--unavailable");
    badge.title = "Market data is not available yet";
    badge.setAttribute(
      "aria-label",
      `${periodLabel} price change is not available yet`
    );
  }
}

function refreshGrowthPercentages() {
  const badges = document.querySelectorAll(".growth-badge");

  badges.forEach(badge => {
    updateGrowthBadge(badge);
  });
}

renderProjects();
refreshGrowthPercentages();

// Refresh the market percentage every 60 seconds.
window.setInterval(refreshGrowthPercentages, 60_000);

if (projectGrid) {
  projectGrid.addEventListener("click", async event => {
    const button = event.target.closest(".copy-contract");
    if (!button) return;

    const contract = button.dataset.contract;

    try {
      await navigator.clipboard.writeText(contract);
      showToast("Contract address copied.");
    } catch (error) {
      // Fallback for browsers where Clipboard API is unavailable.
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = contract;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";

      document.body.appendChild(temporaryInput);
      temporaryInput.select();

      try {
        document.execCommand("copy");
        showToast("Contract address copied.");
      } catch (fallbackError) {
        showToast("Unable to copy. Please copy the contract manually.");
      } finally {
        temporaryInput.remove();
      }
    }
  });
}
