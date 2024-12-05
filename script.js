let bookmarks = [];

// Function to copy bookmark URL to clipboard
function copyBookmarkLink(link) {
    // Create a temporary input element to help with copying
    const tempInput = document.createElement('input');
    tempInput.value = link;
    document.body.appendChild(tempInput);

    // Select the input's content
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    try {
        // Use modern clipboard API
        navigator.clipboard.writeText(link).then(() => {
            // Create a tooltip for user feedback
            const tooltip = document.createElement('div');
            tooltip.textContent = 'Link Copied!';
            tooltip.style.position = 'fixed';
            tooltip.style.top = '20px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.backgroundColor = 'green';
            tooltip.style.color = 'white';
            tooltip.style.padding = '10px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.zIndex = '1000';
            tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

            // Add tooltip to body
            document.body.appendChild(tooltip);

            // Remove tooltip after 2 seconds
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            alert('Failed to copy link');
        });
    } catch (err) {
        // Fallback for older browsers
        try {
            document.execCommand('copy');
            alert('Link copied to clipboard');
        } catch (copyErr) {
            console.error('Could not copy text: ', copyErr);
            alert('Unable to copy link');
        }
    }

    // Remove the temporary input
    document.body.removeChild(tempInput);
}

// Function to add a new bookmark
function addBookmark() {
    const nameInput = document.getElementById("bookmarkName").value.trim();
    const linkInput = document.getElementById("bookmarkLink").value.trim();
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    if (nameInput && urlPattern.test(linkInput)) {
        const formattedLink = linkInput.startsWith('http://') || linkInput.startsWith('https://')
            ? linkInput
            : `https://${linkInput}`;

        bookmarks.push({
            id: Date.now(), // Add unique identifier
            name: nameInput,
            link: formattedLink
        });

        displayBookmarks();
        clearInputs();
        saveBookmarksToLocalStorage(); // Save bookmarks to local storage
    } else {
        alert("Please enter a valid name and URL (e.g., example.com or https://example.com).");
    }
}

// Function to display the bookmarks
function displayBookmarks() {
    const bookmarkList = document.getElementById("bookmarkItems");
    bookmarkList.innerHTML = ""; // Clear the existing items

    // Loop through each bookmark and add it as a list item
    bookmarks.forEach((bookmark) => {
        const listItem = document.createElement("li");
        listItem.classList.add("bookmark-item");

        // Create link element
        const bookmarkLink = document.createElement("a");
        bookmarkLink.href = bookmark.link;
        bookmarkLink.target = "_blank";
        bookmarkLink.textContent = bookmark.name;

        // Create copy button
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.classList.add("copy-btn");
        copyButton.onclick = () => copyBookmarkLink(bookmark.link);

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = () => deleteBookmark(bookmark.id);

        // Append elements to list item
        listItem.appendChild(bookmarkLink);
        listItem.appendChild(copyButton);
        listItem.appendChild(deleteButton);

        bookmarkList.appendChild(listItem);
    });
}

// Function to clear input fields
function clearInputs() {
    document.getElementById("bookmarkName").value = "";
    document.getElementById("bookmarkLink").value = "";
}

// Function to sort bookmarks alphabetically by name
function sortBookmarks() {
    bookmarks.sort((a, b) => a.name.localeCompare(b.name));
    displayBookmarks();
    saveBookmarksToLocalStorage(); // Save sorted bookmarks
}

// Function to delete a bookmark
function deleteBookmark(id) {
    bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    displayBookmarks();
    saveBookmarksToLocalStorage(); // Update local storage
}

// Function to save bookmarks to local storage
function saveBookmarksToLocalStorage() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// Function to load bookmarks from local storage
function loadBookmarksFromLocalStorage() {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
        bookmarks = JSON.parse(savedBookmarks);
        displayBookmarks();
    }
}

// Load bookmarks when the page loads
window.onload = loadBookmarksFromLocalStorage;

// Existing code remains the same, and add these functions:

// Function to reset all bookmarks
function resetBookmarks() {
    // Create a confirmation dialog
    const confirmReset = confirm("Are you sure you want to delete all bookmarks? This action cannot be undone.");

    if (confirmReset) {
        // Clear the bookmarks array
        bookmarks = [];

        // Clear the bookmarks list in the UI
        const bookmarkList = document.getElementById("bookmarkItems");
        bookmarkList.innerHTML = "";

        // Remove bookmarks from local storage
        localStorage.removeItem('bookmarks');

        // Optional: Show a confirmation message
        const resetTooltip = document.createElement('div');
        resetTooltip.textContent = 'All bookmarks have been cleared!';
        resetTooltip.style.position = 'fixed';
        resetTooltip.style.top = '20px';
        resetTooltip.style.left = '50%';
        resetTooltip.style.transform = 'translateX(-50%)';
        resetTooltip.style.backgroundColor = 'grey';
        resetTooltip.style.color = 'white';
        resetTooltip.style.padding = '10px';
        resetTooltip.style.borderRadius = '5px';
        resetTooltip.style.zIndex = '1000';
        resetTooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        resetTooltip.style.opacity = '0'; // Start hidden
        resetTooltip.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        // Add tooltip to body
        document.body.appendChild(resetTooltip);

        // Remove tooltip after 2 seconds

        setTimeout(() => {
            resetTooltip.style.opacity = '1'; // Fade in
            resetTooltip.style.transform = 'translateX(-50%) translateY(10px)'; // Slight movement
        }, 10); // Small delay to ensure transitions apply

        // Remove the tooltip after 3 seconds
        setTimeout(() => {
            resetTooltip.style.opacity = '0'; // Fade out
            resetTooltip.style.transform = 'translateX(-50%) translateY(0)'; // Move back
            setTimeout(() => resetTooltip.remove(), 500); // Remove from DOM after fade-out
        }, 3000); // Display for 3 seconds
    }
}

// Recommended CSS for the reset button
const style = document.createElement('style');
style.textContent = `
    .reset-btn {
       background-color: #8449bca6;
  padding: 10px;
  border: none;
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: -5px 19px 20px 0px rgba(0, 0, 0, 0.3);
  font-family: Roboto, sans-serif;
  font-size: 14px;
  cursor: pointer;
  top: 20px;
  position: relative;

    }
    
    .reset-btn:hover {
        background-color: #d32f2f;
    }
`;
document.head.appendChild(style);