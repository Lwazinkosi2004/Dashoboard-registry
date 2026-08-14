const API_URL = "http://127.0.0.1:50000";

function showSection(sectionId) {
    document.getElementById("dashboardsSection").style.display = "none";
    document.getElementById("dataSourcesSection").style.display = "none";
    document.getElementById(sectionId).style.display = "block";
}

function openDashboardModal() {
    loadDataSourceOptions();
    document.getElementById("dashboardModal").style.display = "flex";
}

function closeDashboardModal() {
    document.getElementById("dashboardModal").style.display = "none";
}

function openDataSourceModal() {
    document.getElementById("dataSourceModal").style.display = "flex";
}

function closeDataSourceModal() {
    document.getElementById("dataSourceModal").style.display = "none";
}

async function loadDashboards() {
    const search = document.getElementById("searchDashboards").value;
    const response = await fetch(`${API_URL}/api/dashboards?search=${encodeURIComponent(search)}`);
    const dashboards = await response.json();
    const tableBody = document.getElementById("dashboardsTableBody");

    tableBody.innerHTML = "";

    dashboards.forEach(dashboard => {
        tableBody.innerHTML += `
            <tr>
                <td>${dashboard.name}</td>
                <td>${dashboard.category}</td>
                <td>${dashboard.owner_name}</td>
                <td><span class="badge ${getStatusClass(dashboard.status)}">${dashboard.status}</span></td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="openDashboardUrl('${dashboard.url}')">Open</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDashboard(${dashboard.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function saveDashboard() {
    const dashboard = {
        name: document.getElementById("dashboardName").value,
        description: document.getElementById("dashboardDescription").value,
        url: document.getElementById("dashboardUrl").value,
        category: document.getElementById("dashboardCategory").value,
        owner_name: document.getElementById("dashboardOwnerName").value,
        status: document.getElementById("dashboardStatus").value,
        data_source_ids: Array.from(
            document.getElementById("dashboardDataSources").selectedOptions
        ).map(option => Number(option.value))
    };

    const response = await fetch(`${API_URL}/api/dashboards`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dashboard)
    });

    const result = await response.json();
    alert(result.message);
    closeDashboardModal();
    loadDashboards();
}

async function loadDataSources() {
    const response = await fetch(`${API_URL}/api/data_sources`);
    const sources = await response.json();
    const tableBody = document.getElementById("dataSourcesTableBody");

    tableBody.innerHTML = "";

    sources.forEach(source => {
        tableBody.innerHTML += `
            <tr>
                <td>${source.name}</td>
                <td>${source.type}</td>
                <td>${source.description}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteDataSource(${source.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function saveDataSource() {
    const dataSource = {
        name: document.getElementById("dataSourceName").value,
        type: document.getElementById("dataSourceType").value,
        description: document.getElementById("dataSourceDescription").value
    };

    const response = await fetch(`${API_URL}/api/data_sources`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSource)
    });

    const result = await response.json();
    alert(result.message);
    closeDataSourceModal();
    loadDataSources();
    loadDataSourceOptions();
}

function openDashboardUrl(url) {
    window.open(url, "_blank");
}

async function deleteDashboard(id) {
    const confirmDelete = confirm("Delete dashboard?");

    if (!confirmDelete) {
        return;
    }

    await fetch(`${API_URL}/api/dashboards/${id}`, {
        method: "DELETE"
    });

    loadDashboards();
}

async function deleteDataSource(id) {
    const confirmDelete = confirm("Delete data source?");

    if (!confirmDelete) {
        return;
    }

    await fetch(`${API_URL}/api/data_sources/${id}`, {
        method: "DELETE"
    });

    loadDataSources();
    loadDataSourceOptions();
}

async function loadDataSourceOptions() {
    const response = await fetch(`${API_URL}/api/data_sources`);
    const sources = await response.json();
    const select = document.getElementById("dashboardDataSources");

    select.innerHTML = "";
    sources.forEach(source => {
        select.innerHTML += `
            <option value="${source.id}">
                ${source.name}
            </option>
        `;
    });
}

function getStatusClass(status) {
    if (status === "up") {
        return "bg-success";
    }

    if (status === "down") {
        return "bg-danger";
    }

    return "bg-secondary";
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchDashboards").addEventListener("keyup", loadDashboards);
    loadDashboards();
    loadDataSources();
    loadDataSourceOptions();
});
