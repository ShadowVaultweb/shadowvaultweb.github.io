/*
  SHADOWVAULT PROJECT LIST
  ------------------------
  To add a new coin later, replace one of the locked objects with a project
  using the same fields as SCORN: name, ticker, description, image, contract,
  pumpUrl and status.
*/

const projects = [
  {
  name: "SCORN",
  ticker: "$SCORN",
  description: "The cutest red flag on Solana. No fake utility, no guaranteed profits, and no complicated roadmap—just corn, memes, and community chaos.",
  image: "scorn.jpg",
  contract: "BkBpR1JRsQM8EGrRrVBGftxdmvAYr1EBoqjnGPfApump",
  pumpUrl: "https://pump.fun/coin/BkBpR1JRsQM8EGrRrVBGftxdmvAYr1EBoqjnGPfApump",
  status: "LIVE",
  locked: false
  },
  { locked: true },
  { locked: true },
  { locked: true },
  { locked: true },
  { locked: true }
];

const projectGrid = document.querySelector("#project-grid");
const toast = document.querySelector("#toast");
const currentYear = document.querySelector("#current-year");

currentYear.textContent = new Date().getFullYear();

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
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
        <p class="project-description">A new project is waiting inside the Vault.</p>

        <div class="contract-box">
          <span class="contract-label">Contract Address</span>
          <span class="contract-value">Not available</span>
        </div>

        <div class="card-actions">
          <button class="card-button" type="button" disabled>CONTRACT PENDING</button>
          <button class="card-button" type="button" disabled>PROJECT LOCKED</button>
        </div>
      </div>
    </article>
  `;
}

function createProjectCard(project) {
  const hasContract = project.contract && project.contract !== "Coming Soon";
  const hasPumpUrl = Boolean(project.pumpUrl);

  const copyButton = hasContract
    ? `<button class="card-button copy-contract" type="button" data-contract="${escapeHTML(project.contract)}">COPY CONTRACT</button>`
    : `<button class="card-button" type="button" disabled>CONTRACT PENDING</button>`;

  const pumpButton = hasPumpUrl
    ? `<a class="card-button card-button--primary" href="${escapeHTML(project.pumpUrl)}" target="_blank" rel="noopener noreferrer">VIEW ON PUMP.FUN</a>`
    : `<span class="card-button card-button--primary" aria-disabled="true">PUMP.FUN SOON</span>`;

  return `
    <article class="project-card" aria-label="${escapeHTML(project.name)} project">
      <div class="project-media">
        <span class="project-status project-status--live">${escapeHTML(project.status)}</span>
        <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.name)} meme coin logo" loading="eager" />
      </div>

      <div class="project-content">
        <div class="project-title-row">
          <h3 class="project-name">${escapeHTML(project.name)}</h3>
          <span class="project-ticker">${escapeHTML(project.ticker)}</span>
        </div>
        <p class="project-description">${escapeHTML(project.description)}</p>

        <div class="contract-box">
          <span class="contract-label">Contract Address</span>
          <span class="contract-value" title="${escapeHTML(project.contract)}">${escapeHTML(project.contract)}</span>
        </div>

        <div class="card-actions">
          ${copyButton}
          ${pumpButton}
        </div>
      </div>
    </article>
  `;
}

projectGrid.innerHTML = projects
  .map((project, index) => project.locked ? createLockedCard(index) : createProjectCard(project))
  .join("");

projectGrid.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-contract");
  if (!button) return;

  const contract = button.dataset.contract;

  try {
    await navigator.clipboard.writeText(contract);
    showToast("Contract address copied.");
  } catch (error) {
    showToast("Unable to copy. Please copy the contract manually.");
  }
});
