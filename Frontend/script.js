const API_URL = "http://127.0.0.1:5000";
let editingDashboardId = null;
let editingDataSourceId = null;

async function fetchJson(url, options) {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || `Request failed (${response.status})`);
    }
    return result;
}

function showSection(sectionId) {
    document.getElementById("dashboardsSection").style.display = "none";
    document.getElementById("dataSourcesSection").style.display = "none";
    document.getElementById(sectionId).style.display = "block";
}

function openDashboardModal() {
    editingDashboardId = null;
    document.getElementById("dashboardModalTitle").textContent = "Add Dashboard";
    document.getElementById("saveDashboardButton").textContent = "Save Dashboard";
    document.getElementById("dashboardName").value = "";
    document.getElementById("dashboardDescription").value = "";
    document.getElementById("dashboardUrl").value = "";
    document.getElementById("dashboardCategory").value = "";
    document.getElementById("dashboardOwnerName").value = "";
    document.getElementById("dashboardStatus").value = "up";
    loadDataSourceOptions();
    document.getElementById("dashboardModal").style.display = "flex";
}

async function editDashboard(id) {
    try {
        const [dashboard] = await Promise.all([
            fetchJson(`${API_URL}/api/dashboards/${id}`),
            loadDataSourceOptions()
        ]);
        editingDashboardId = id;
        document.getElementById("dashboardName").value = dashboard.name;
        document.getElementById("dashboardDescription").value = dashboard.description || "";
        document.getElementById("dashboardUrl").value = dashboard.url;
        document.getElementById("dashboardCategory").value = dashboard.category;
        document.getElementById("dashboardOwnerName").value = dashboard.owner_name;
        document.getElementById("dashboardStatus").value = dashboard.status.toLowerCase();
        const linkedSourceIds = new Set(dashboard.data_source_ids);
        Array.from(document.getElementById("dashboardDataSources").options)
            .forEach(option => {
                option.selected = linkedSourceIds.has(Number(option.value));
            });
        document.getElementById("dashboardModalTitle").textContent = "Edit Dashboard";
        document.getElementById("saveDashboardButton").textContent = "Update Dashboard";
        document.getElementById("dashboardModal").style.display = "flex";
    } catch (error) {
        alert(`Could not open dashboard: ${error.message}`);
    }
}

function closeDashboardModal() {
    document.getElementById("dashboardModal").style.display = "none";
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
                    <button class="btn btn-warning btn-sm" onclick="editDashboard(${dashboard.id})">Edit</button>
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

    try {
        const result = await fetchJson(
            editingDashboardId
                ? `${API_URL}/api/dashboards/${editingDashboardId}`
                : `${API_URL}/api/dashboards`,
            {
                method: editingDashboardId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dashboard)
            }
        );
        alert(result.message);
        closeDashboardModal();
        loadDashboards();
    } catch (error) {
        alert(`Could not save dashboard: ${error.message}`);
    }
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
                    <button class="btn btn-warning btn-sm" onclick="editDataSource(${source.id})">Edit</button>
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

    try {
        const result = await fetchJson(
            editingDataSourceId
                ? `${API_URL}/api/data_sources/${editingDataSourceId}`
                : `${API_URL}/api/data_sources`,
            {
                method: editingDataSourceId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataSource)
            }
        );
        alert(result.message);
        closeDataSourceModal();
        loadDataSources();
        loadDataSourceOptions();
    } catch (error) {
        alert(`Could not save data source: ${error.message}`);
    }
}

function openDataSourceModal() {
    editingDataSourceId = null;
    document.getElementById("dataSourceModalTitle").textContent = "Add Data Source";
    document.getElementById("saveDataSourceButton").textContent = "Save Data Source";
    document.getElementById("dataSourceName").value = "";
    document.getElementById("dataSourceType").value = "";
    document.getElementById("dataSourceDescription").value = "";
    document.getElementById("dataSourceModal").style.display = "flex";
}

async function editDataSource(id) {
    try {
        const source = await fetchJson(`${API_URL}/api/data_sources/${id}`);
        editingDataSourceId = id;
        document.getElementById("dataSourceName").value = source.name;
        const typeSelect = document.getElementById("dataSourceType");
        const typeOption = Array.from(typeSelect.options)
            .find(option => option.value.toLowerCase() === source.type.toLowerCase());
        typeSelect.value = typeOption ? typeOption.value : "";
        document.getElementById("dataSourceDescription").value = source.description || "";
        document.getElementById("dataSourceModalTitle").textContent = "Edit Data Source";
        document.getElementById("saveDataSourceButton").textContent = "Update Data Source";
        document.getElementById("dataSourceModal").style.display = "flex";
    } catch (error) {
        alert(`Could not open data source: ${error.message}`);
    }
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
