document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('guest-search');
    const resultsArea = document.getElementById('results-area');
    const clearBtn = document.getElementById('clear-search');
    let guests = [];

    // Load and parse CSV
    // Add cache buster to force reload
    Papa.parse('seating_chart.csv?v=' + new Date().getTime(), {
        download: true,
        header: true,
        complete: function (results) {
            // Filter out empty rows or rows without table numbers
            guests = results.data.filter(guest =>
                guest['First Name'] &&
                guest['Table Number'] &&
                guest['First Name'].toLowerCase() !== 'not attending'
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

        if (query.length < 1) {
            resultsArea.innerHTML = '';
            return;
        }

        const filteredGuests = guests.filter(guest => {
            const firstName = (guest['First Name'] || '').toLowerCase();
            const lastName = (guest['Last Name'] || '').toLowerCase();
            const nickname = (guest['Nickname/Group Name'] || '').toLowerCase();
            const fullName = `${firstName} ${lastName}`.toLowerCase();

            return firstName.includes(query) ||
                lastName.includes(query) ||
                nickname.includes(query) ||
                fullName.includes(query);
        });

        displayResults(filteredGuests);
    });

    // Clear search
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        resultsArea.innerHTML = '';

        // Clear highlights
        document.querySelectorAll('.highlight-table').forEach(el => el.classList.remove('highlight-table'));
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
            const firstName = guest['First Name'] || '';
            const lastName = guest['Last Name'] || '';

            // Display full name only
            const displayName = `${firstName} ${lastName}`.trim();

            const card = document.createElement('div');
            card.className = 'guest-card';

            card.innerHTML = `
                <div class="guest-info">
                    <div class="guest-name">${displayName}</div>
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
                const firstName = guest['First Name'] || '';
                const lastName = guest['Last Name'] || '';
                const displayName = `${firstName} ${lastName}`.trim();

                const div = document.createElement('div');
                div.className = 'modal-guest-item';
                div.textContent = displayName;
                modalGuestList.appendChild(div);
            });
        }

        modal.classList.add('active');
    }
});
