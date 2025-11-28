document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('guest-search');
    const resultsArea = document.getElementById('results-area');
    const clearBtn = document.getElementById('clear-search');
    const viewAllBtn = document.getElementById('view-all-btn');
    let guests = [];
    let isViewAll = false;

    // Load and parse CSV
    Papa.parse('seating_chart.csv', {
        download: true,
        header: true,
        complete: function (results) {
            // Filter out empty rows or rows without table numbers
            guests = results.data.filter(guest =>
                guest['Guest Name'] &&
                guest['Table Number']
            );
            console.log("Loaded " + guests.length + " guests from seating chart");
        },
        error: function (err) {
            console.error("Error loading CSV:", err);
            resultsArea.innerHTML = '<div class="placeholder-message">Error loading guest list. Please try again later.</div>';
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        // Show/hide clear button
        clearBtn.style.display = query.length > 0 ? 'block' : 'none';

        if (query.length < 2) {
            resultsArea.innerHTML = '<div class="placeholder-message">Enter your first and last name above to find your table.</div>';
            return;
        }

        isViewAll = false;
        viewAllBtn.textContent = "View All Guests";

        const filteredGuests = guests.filter(guest => {
            if (!guest['Guest Name']) return false;
            return guest['Guest Name'].toLowerCase().includes(query);
        });

        displayResults(filteredGuests);
    });

    // Clear search
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        resultsArea.innerHTML = '<div class="placeholder-message">Enter your first and last name above to find your table.</div>';

        // Clear highlights
        document.querySelectorAll('.highlight-table').forEach(el => el.classList.remove('highlight-table'));
    });

    // View All
    viewAllBtn.addEventListener('click', () => {
        if (isViewAll) {
            // Reset
            isViewAll = false;
            viewAllBtn.textContent = "View All Guests";
            searchInput.value = '';
            clearBtn.style.display = 'none';
            resultsArea.innerHTML = '<div class="placeholder-message">Enter your first and last name above to find your table.</div>';
            document.querySelectorAll('.highlight-table').forEach(el => el.classList.remove('highlight-table'));
        } else {
            // Show all
            isViewAll = true;
            viewAllBtn.textContent = "Hide Guest List";
            searchInput.value = '';
            clearBtn.style.display = 'none';
            displayResults(guests);
        }
    });

    function displayResults(results) {
        resultsArea.innerHTML = '';
        // Clear previous highlights
        document.querySelectorAll('.highlight-table').forEach(el => el.classList.remove('highlight-table'));

        if (results.length === 0) {
            resultsArea.innerHTML = '<div class="placeholder-message">No guests found. Please check the spelling.</div>';
            return;
        }

        results.forEach(guest => {
            const tableNum = guest['Table Number'];
            const guestName = guest['Guest Name'];

            const card = document.createElement('div');
            card.className = 'guest-card';

            card.innerHTML = `
                <div class="guest-info">
                    <div class="guest-name">${guestName}</div>
                </div>
                <div class="table-assignment">
                    <span class="table-label">Table</span>
                    <span class="table-number">${tableNum || '-'}</span>
                </div>
            `;

            // Add click event to highlight table
            card.addEventListener('click', () => {
                highlightTable(tableNum);
                // Scroll map into view on mobile
                document.getElementById('seating-map').scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            resultsArea.appendChild(card);
        });

        // If only one result, highlight it automatically
        if (results.length === 1) {
            highlightTable(results[0]['Table Number']);
        }
    }

    function highlightTable(tableNum) {
        // Clear previous highlights
        document.querySelectorAll('.highlight-table').forEach(el => el.classList.remove('highlight-table'));

        if (!tableNum || tableNum === '-') return;

        const tableId = `table-${tableNum}`;
        const tableElement = document.getElementById(tableId);

        if (tableElement) {
            tableElement.classList.add('highlight-table');
        }
    }

    // Modal Elements - Create modal dynamically since it's not in HTML
    let modal = document.getElementById('table-modal');

    // Create modal if it doesn't exist
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'table-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <h2 id="modal-table-title">Table</h2>
                <div id="modal-guest-list" class="modal-guest-list"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const closeModalBtn = modal.querySelector('.close-modal');
    const modalTitle = modal.querySelector('#modal-table-title');
    const modalGuestList = modal.querySelector('#modal-guest-list');

    // Close modal events
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Add click listeners to all tables
    document.querySelectorAll('.table-group').forEach(group => {
        group.addEventListener('click', () => {
            const tableNum = group.getAttribute('data-table');
            if (tableNum) {
                showTableGuests(tableNum);
            }
        });
    });

    function showTableGuests(tableNum) {
        // Filter guests for this table
        const tableGuests = guests.filter(g => g['Table Number'] === tableNum);

        modalTitle.textContent = `Table ${tableNum}`;
        modalGuestList.innerHTML = '';

        if (tableGuests.length === 0) {
            modalGuestList.innerHTML = '<div class="modal-guest-item">No guests assigned</div>';
        } else {
            tableGuests.forEach(guest => {
                const div = document.createElement('div');
                div.className = 'modal-guest-item';
                div.textContent = guest['Guest Name'];
                modalGuestList.appendChild(div);
            });
        }

        modal.classList.add('active');
    }
});
