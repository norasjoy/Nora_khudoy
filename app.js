const statuses = ["New", "In Progress", "Waiting", "Resolved"];
const priorityOrder = { P1: 1, P2: 2, P3: 3, P4: 4 };
const priorityNames = { P1: "Critical", P2: "High", P3: "Medium", P4: "Low" };
const priorityLevels = ["P4", "P3", "P2", "P1"];
const priorityColors = { P1: "#d35853", P2: "#d69a44", P3: "#6586d2", P4: "#8994a5" };
const responseTargets = { P1: 1, P2: 4, P3: 8, P4: 24 };
const statusColors = { New: "#6c83db", "In Progress": "#d39a48", Waiting: "#9474c4", Resolved: "#4ca788" };
const basePriorityMatrix = {
  High: { High: "P1", Medium: "P2", Low: "P2" },
  Medium: { High: "P2", Medium: "P3", Low: "P3" },
  Low: { High: "P2", Medium: "P3", Low: "P4" },
};
const audienceEscalation = { "One user": 0, Team: 1, "Whole organization": 2 };
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);

const ticketSeed = [
  { id: "SD-2481", title: "Production checkout unavailable", requester: "Maya Chen", team: "Payments", impact: "High", urgency: "High", affectedUsers: "Whole organization", status: "New", createdAt: hoursAgo(3.2) },
  { id: "SD-2479", title: "VPN access failing for remote team", requester: "Oliver Grant", team: "Workplace IT", impact: "High", urgency: "Medium", affectedUsers: "Team", status: "In Progress", createdAt: hoursAgo(2.1) },
  { id: "SD-2477", title: "Monthly report export is delayed", requester: "Priya Shah", team: "Data Services", impact: "Medium", urgency: "Medium", affectedUsers: "Team", status: "New", createdAt: hoursAgo(5.4) },
  { id: "SD-2475", title: "New starter needs account access", requester: "Sam Rivera", team: "Identity", impact: "Low", urgency: "High", affectedUsers: "One user", status: "Waiting", createdAt: hoursAgo(7.5) },
  { id: "SD-2472", title: "Intermittent errors on customer portal", requester: "Ella Thompson", team: "Web Platform", impact: "High", urgency: "High", affectedUsers: "Team", status: "In Progress", createdAt: hoursAgo(1.3) },
  { id: "SD-2468", title: "Request to update team distribution list", requester: "Noah Williams", team: "Workplace IT", impact: "Low", urgency: "Low", affectedUsers: "One user", status: "New", createdAt: hoursAgo(11) },
  { id: "SD-2465", title: "Shared drive permissions need review", requester: "Ava Patel", team: "Identity", impact: "Medium", urgency: "Low", affectedUsers: "One user", status: "Resolved", createdAt: hoursAgo(30) },
  { id: "SD-2462", title: "Customer records not syncing overnight", requester: "Leo Martin", team: "Data Services", impact: "High", urgency: "Medium", affectedUsers: "Whole organization", status: "Waiting", createdAt: hoursAgo(10) },
];

function calculatePriority(impact, urgency, affectedUsers) {
  const basePriority = basePriorityMatrix[impact][urgency];
  const baseLevel = priorityLevels.indexOf(basePriority);
  const escalatedLevel = Math.min(priorityLevels.length - 1, baseLevel + audienceEscalation[affectedUsers]);
  return priorityLevels[escalatedLevel];
}

function getPriorityReason(ticket) {
  const basePriority = basePriorityMatrix[ticket.impact][ticket.urgency];
  const priority = calculatePriority(ticket.impact, ticket.urgency, ticket.affectedUsers);
  const reason = `${ticket.impact} impact, ${ticket.urgency.toLowerCase()} urgency, ${ticket.affectedUsers.toLowerCase()} affected`;
  if (basePriority === priority) return reason;
  return `${reason}; scope raises ${priorityNames[basePriority]} to ${priorityNames[priority]}`;
}

const tickets = ticketSeed.map((ticket) => {
  const priority = calculatePriority(ticket.impact, ticket.urgency, ticket.affectedUsers);
  const responseDeadline = new Date(ticket.createdAt.getTime() + responseTargets[priority] * 60 * 60 * 1000);
  return { ...ticket, priority, responseDeadline };
});

const rowsElement = document.querySelector("#ticket-rows");
const emptyState = document.querySelector("#empty-state");
const priorityFilter = document.querySelector("#priority-filter");
const statusFilter = document.querySelector("#status-filter");
const sortOrder = document.querySelector("#sort-order");

function isOverdue(ticket, now = Date.now()) {
  return ticket.status !== "Resolved" && ticket.responseDeadline.getTime() < now;
}

function formatDeadline(date) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function formatRelativeDeadline(date, now = Date.now()) {
  const difference = date.getTime() - now;
  const minutes = Math.round(Math.abs(difference) / 60000);
  if (minutes < 60) return difference < 0 ? `${minutes}m ago` : `in ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const duration = remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
  return difference < 0 ? `${duration} ago` : `in ${duration}`;
}

function renderCounts() {
  const activeTickets = tickets.filter((ticket) => ticket.status !== "Resolved");
  document.querySelector("#active-count").textContent = activeTickets.length;
  document.querySelector("#overdue-count").textContent = activeTickets.filter((ticket) => isOverdue(ticket)).length;
  document.querySelector("#status-counts").innerHTML = statuses.map((status) => `
    <span class="count-item"><span class="count-dot" style="--dot-color:${statusColors[status]}"></span>${status}<strong>${tickets.filter((ticket) => ticket.status === status).length}</strong></span>
  `).join("");
  document.querySelector("#priority-counts").innerHTML = Object.keys(priorityOrder).map((priority) => `
    <span class="count-item"><span class="count-dot" style="--dot-color:${priorityColors[priority]}"></span>${priority}<strong>${tickets.filter((ticket) => ticket.priority === priority).length}</strong></span>
  `).join("");
}

function renderTickets() {
  const selectedPriority = priorityFilter.value;
  const selectedStatus = statusFilter.value;
  const visibleTickets = tickets
    .filter((ticket) => selectedPriority === "all" || ticket.priority === selectedPriority)
    .filter((ticket) => selectedStatus === "all" || ticket.status === selectedStatus)
    .sort((a, b) => {
      if (sortOrder.value === "deadline") return a.responseDeadline - b.responseDeadline;
      return priorityOrder[a.priority] - priorityOrder[b.priority] || a.responseDeadline - b.responseDeadline;
    });

  document.querySelector("#visible-count").textContent = visibleTickets.length;
  rowsElement.innerHTML = visibleTickets.map((ticket) => {
    const overdue = isOverdue(ticket);
    const targetLabel = `${responseTargets[ticket.priority]}h target`;
    return `
      <tr>
        <td class="ticket-cell">
          <span class="ticket-id">${ticket.id}</span>
          <span class="ticket-title">${ticket.title}</span>
          <span class="ticket-meta">${ticket.requester} · ${ticket.team}</span>
        </td>
        <td class="signal-cell">
          <div><span class="signal-label">Impact</span>${ticket.impact}</div>
          <div><span class="signal-label">Urgency</span>${ticket.urgency}</div>
          <div><span class="signal-label">Users</span>${ticket.affectedUsers}</div>
        </td>
        <td class="priority-cell">
          <span class="priority-badge priority-${ticket.priority}">${ticket.priority} · ${priorityNames[ticket.priority]}</span>
          <div class="priority-reason">${getPriorityReason(ticket)}</div>
        </td>
        <td class="deadline-cell">
          <span class="deadline-time">${formatDeadline(ticket.responseDeadline)}</span>
          <span class="deadline-relative">${targetLabel} · ${formatRelativeDeadline(ticket.responseDeadline)}</span>
          ${ticket.status === "Resolved" ? '<span class="on-track-label">Resolved</span>' : overdue ? '<span class="overdue-label">● Response overdue</span>' : '<span class="on-track-label">● Within target</span>'}
        </td>
        <td class="status-cell">
          <label class="sr-only" for="status-${ticket.id}">Update status for ${ticket.id}</label>
          <select class="status-select" id="status-${ticket.id}" data-ticket-id="${ticket.id}">
            ${statuses.map((status) => `<option value="${status}"${ticket.status === status ? " selected" : ""}>${status}</option>`).join("")}
          </select>
        </td>
      </tr>
    `;
  }).join("");

  emptyState.hidden = visibleTickets.length > 0;
}

function render() {
  renderCounts();
  renderTickets();
}

priorityFilter.addEventListener("change", render);
statusFilter.addEventListener("change", render);
sortOrder.addEventListener("change", render);
rowsElement.addEventListener("change", (event) => {
  const select = event.target.closest("[data-ticket-id]");
  if (!select) return;
  const ticket = tickets.find((item) => item.id === select.dataset.ticketId);
  if (!ticket) return;
  ticket.status = select.value;
  render();
});

render();
window.setInterval(render, 60_000);
