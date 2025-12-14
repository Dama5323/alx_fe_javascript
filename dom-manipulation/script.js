// Quote Generator Application with Advanced Features

class QuoteGenerator {
    constructor() {
        this.quotes = [];
        this.currentQuoteIndex = 0;
        this.selectedCategory = 'all';
        this.lastSyncTime = null;
        this.syncInterval = null;
        this.isAddingQuote = false;
        this.serverUrl = 'https://jsonplaceholder.typicode.com';
        this.isOnline = true;
        
        this.initializeApp();
    }
    
    initializeApp() {
        // Load quotes from local storage or initialize with default quotes
        this.loadQuotesFromStorage();
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Populate categories
        this.populateCategories();
        
        // Show initial quote
        this.showRandomQuote();
        
        // Load last selected filter
        this.loadLastFilter();
        
        // Start periodic sync
        this.startSyncInterval();
        
        // Update statistics
        this.updateStatistics();
        
        // Check online status
        this.checkOnlineStatus();
    }
    
    // Task 1 Requirement: Default quotes
    getDefaultQuotes() {
        return [
            {
                text: "The only way to do great work is to love what you do.",
                category: "Inspiration",
                id: 1,
                timestamp: Date.now() - 86400000,
                source: "local",
                serverId: null
            },
            {
                text: "Innovation distinguishes between a leader and a follower.",
                category: "Leadership",
                id: 2,
                timestamp: Date.now() - 172800000,
                source: "local",
                serverId: null
            },
            {
                text: "Your time is limited, so don't waste it living someone else's life.",
                category: "Wisdom",
                id: 3,
                timestamp: Date.now() - 259200000,
                source: "local",
                serverId: null
            },
            {
                text: "Stay hungry, stay foolish.",
                category: "Motivation",
                id: 4,
                timestamp: Date.now() - 345600000,
                source: "local",
                serverId: null
            },
            {
                text: "The future belongs to those who believe in the beauty of their dreams.",
                category: "Dreams",
                id: 5,
                timestamp: Date.now() - 432000000,
                source: "local",
                serverId: null
            }
        ];
    }
    
    // Task 1 & 2: Load quotes from local storage
    loadQuotesFromStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            try {
                this.quotes = JSON.parse(storedQuotes);
                this.showNotification('Quotes loaded from local storage', 'info');
            } catch (error) {
                this.quotes = this.getDefaultQuotes();
                this.showNotification('Error loading quotes, using defaults', 'error');
            }
        } else {
            this.quotes = this.getDefaultQuotes();
            this.saveQuotes();
            this.showNotification('Default quotes loaded', 'info');
        }
        
        // Load from session storage for last viewed
        const lastViewed = sessionStorage.getItem('lastViewedQuote');
        if (lastViewed) {
            try {
                const quote = JSON.parse(lastViewed);
                this.showNotification(`Welcome back! Last viewed: "${quote.text.substring(0, 50)}..."`, 'info');
            } catch (error) {
                // Ignore session storage errors
            }
        }
    }
    
    // Task 2: Save quotes to local storage
    saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(this.quotes));
        localStorage.setItem('lastUpdate', new Date().toISOString());
        sessionStorage.setItem('quoteCount', this.quotes.length.toString());
        this.updateStatistics();
    }
    
    // Task 3: Update statistics display
    updateStatistics() {
        document.getElementById('totalQuotes').textContent = this.quotes.length;
        document.getElementById('totalCategories').textContent = this.getUniqueCategories().length;
        const lastUpdate = localStorage.getItem('lastUpdate');
        document.getElementById('lastUpdated').textContent = lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never';
        
        // Check online status
        const status = this.isOnline ? 'Online' : 'Offline';
        const statusColor = this.isOnline ? '#2ecc71' : '#e74c3c';
        document.getElementById('storageStatus').textContent = status;
        document.getElementById('storageStatus').style.color = statusColor;
        
        // Show sync status
        if (this.lastSyncTime) {
            const syncTime = document.createElement('small');
            syncTime.textContent = `Last sync: ${new Date(this.lastSyncTime).toLocaleTimeString()}`;
            syncTime.style.display = 'block';
            syncTime.style.fontSize = '12px';
            syncTime.style.color = '#95a5a6';
            document.getElementById('storageStatus').appendChild(syncTime);
        }
    }
    
    // Task 3: Get unique categories
    getUniqueCategories() {
        const categories = this.quotes.map(quote => quote.category);
        return [...new Set(categories)];
    }
    
    // Task 3: Populate categories in dropdown
    populateCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        const uniqueCategories = this.getUniqueCategories();
        
        // Clear existing options except "All Categories"
        while (categoryFilter.options.length > 1) {
            categoryFilter.remove(1);
        }
        
        // Add category options
        uniqueCategories.sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // Add "Add New Category" option
        const addNewOption = document.createElement('option');
        addNewOption.value = 'add_new';
        addNewOption.textContent = '+ Add New Category';
        addNewOption.style.color = '#667eea';
        addNewOption.style.fontWeight = 'bold';
        categoryFilter.appendChild(addNewOption);
    }
    
    // Task 1 Requirement: Show random quote
    showRandomQuote() {
        if (this.quotes.length === 0) {
            this.showNotification('No quotes available', 'warning');
            this.displayEmptyState();
            return;
        }
        
        let filteredQuotes = this.quotes;
        if (this.selectedCategory !== 'all') {
            filteredQuotes = this.quotes.filter(quote => quote.category === this.selectedCategory);
        }
        
        if (filteredQuotes.length === 0) {
            this.showNotification('No quotes in selected category', 'warning');
            this.displayEmptyState();
            return;
        }
        
        this.currentQuoteIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[this.currentQuoteIndex];
        
        this.displayQuote(quote);
        
        // Store last viewed quote in session storage
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    }
    
    // Display quote in the UI
    displayQuote(quote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quoteCategory = document.getElementById('quoteCategory');
        const quoteCounter = document.getElementById('quoteCounter');
        
        quoteDisplay.innerHTML = `
            <div class="quote-text">
                <i class="fas fa-quote-left fa-lg quote-icon"></i>
                ${this.escapeHtml(quote.text)}
                <i class="fas fa-quote-right fa-lg quote-icon"></i>
            </div>
            ${quote.source === 'server' ? 
                `<div class="server-badge">
                    <i class="fas fa-server"></i> From Server (ID: ${quote.serverId})
                </div>` : 
                quote.source === 'sync' ?
                `<div class="sync-badge">
                    <i class="fas fa-sync"></i> Synced
                </div>` : ''
            }
        `;
        
        quoteCategory.textContent = quote.category;
        quoteCounter.textContent = `Quote ${this.quotes.findIndex(q => q.id === quote.id) + 1} of ${this.quotes.length}`;
    }
    
    displayEmptyState() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `
            <div class="quote-placeholder">
                <i class="fas fa-quote-left fa-2x"></i>
                <p>No quotes available. Add some quotes to get started!</p>
                ${!this.isOnline ? '<p class="offline-warning"><i class="fas fa-wifi-slash"></i> You are currently offline</p>' : ''}
            </div>
        `;
        document.getElementById('quoteCategory').textContent = 'No Category';
        document.getElementById('quoteCounter').textContent = 'Quote 0 of 0';
    }
    
    // Task 3: Filter quotes by category
    filterQuotes() {
        const categoryFilter = document.getElementById('categoryFilter');
        const selectedValue = categoryFilter.value;
        
        if (selectedValue === 'add_new') {
            this.showAddCategoryForm();
            return;
        }
        
        this.selectedCategory = selectedValue;
        
        // Save filter preference to local storage
        localStorage.setItem('lastCategoryFilter', this.selectedCategory);
        
        // Show random quote from filtered category
        this.showRandomQuote();
        
        // Update UI
        if (selectedValue === 'all') {
            this.showNotification('Showing all quotes', 'info');
        } else {
            this.showNotification(`Filtering by: ${selectedValue}`, 'info');
        }
    }
    
    // Task 3: Load last selected filter
    loadLastFilter() {
        const lastFilter = localStorage.getItem('lastCategoryFilter');
        if (lastFilter) {
            document.getElementById('categoryFilter').value = lastFilter;
            this.selectedCategory = lastFilter;
        }
    }
    
    // Task 1 Requirement: createAddQuoteForm function
    createAddQuoteForm() {
        if (this.isAddingQuote) return;
        
        this.isAddingQuote = true;
        
        // Remove existing form if present
        const existingForm = document.querySelector('.add-quote-form-container');
        if (existingForm) {
            existingForm.remove();
        }
        
        // Create form container
        const formContainer = document.createElement('div');
        formContainer.className = 'add-quote-form-container';
        formContainer.innerHTML = `
            <h3><i class="fas fa-plus-circle"></i> Add New Quote</h3>
            <div class="form-group">
                <textarea id="newQuoteText" class="form-textarea" 
                    placeholder="Enter your inspirational quote here..." 
                    rows="3"></textarea>
                <div class="category-input-group">
                    <input id="newQuoteCategory" type="text" 
                        class="form-input" 
                        placeholder="Enter category">
                    <select id="existingCategories" class="form-select">
                        <option value="">Or select existing category</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button id="submitQuoteBtn" class="btn primary-btn">
                        <i class="fas fa-check"></i> Add Quote
                    </button>
                    <button id="cancelQuoteBtn" class="btn secondary-btn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;
        
        // Insert form before the existing form container
        const existingFormContainer = document.querySelector('.form-container');
        existingFormContainer.parentNode.insertBefore(formContainer, existingFormContainer);
        
        // Populate existing categories
        this.populateExistingCategories();
        
        // Add event listeners for the new form
        this.setupAddQuoteFormEvents();
        
        // Focus on textarea
        document.getElementById('newQuoteText').focus();
    }
    
    populateExistingCategories() {
        const select = document.getElementById('existingCategories');
        const categories = this.getUniqueCategories();
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    }
    
    setupAddQuoteFormEvents() {
        const submitBtn = document.getElementById('submitQuoteBtn');
        const cancelBtn = document.getElementById('cancelQuoteBtn');
        const categorySelect = document.getElementById('existingCategories');
        const categoryInput = document.getElementById('newQuoteCategory');
        
        submitBtn.addEventListener('click', () => this.addQuote());
        cancelBtn.addEventListener('click', () => this.removeAddQuoteForm());
        
        categorySelect.addEventListener('change', (e) => {
            if (e.target.value) {
                categoryInput.value = e.target.value;
            }
        });
        
        // Allow Enter key to submit
        document.getElementById('newQuoteText').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.addQuote();
            }
        });
    }
    
    removeAddQuoteForm() {
        const formContainer = document.querySelector('.add-quote-form-container');
        if (formContainer) {
            formContainer.remove();
        }
        this.isAddingQuote = false;
    }
    
    // Task 1 Requirement: Add new quote
    async addQuote() {
        const textInput = document.getElementById('newQuoteText');
        const categoryInput = document.getElementById('newQuoteCategory');
        
        let text, category;
        
        // Check which form is being used
        if (textInput && categoryInput) {
            // Using the dynamic form
            text = textInput.value.trim();
            category = categoryInput.value.trim();
        } else {
            // Using the static form
            text = document.getElementById('newQuoteText')?.value.trim();
            category = document.getElementById('newQuoteCategory')?.value.trim();
        }
        
        if (!text) {
            this.showNotification('Please enter a quote text', 'error');
            document.getElementById('newQuoteText')?.focus();
            return;
        }
        
        if (!category) {
            this.showNotification('Please enter a category', 'error');
            document.getElementById('newQuoteCategory')?.focus();
            return;
        }
        
        // Check for duplicate quote
        const isDuplicate = this.quotes.some(quote => 
            quote.text.toLowerCase() === text.toLowerCase() && 
            quote.category.toLowerCase() === category.toLowerCase()
        );
        
        if (isDuplicate) {
            this.showNotification('This quote already exists in the selected category', 'warning');
            return;
        }
        
        const newQuote = {
            text: text,
            category: category,
            id: Date.now(),
            timestamp: Date.now(),
            source: 'user',
            serverId: null,
            pendingSync: true
        };
        
        this.quotes.push(newQuote);
        this.saveQuotes();
        
        // Update categories dropdown
        this.populateCategories();
        
        // Clear inputs
        if (textInput) textInput.value = '';
        if (categoryInput) categoryInput.value = '';
        
        // Remove dynamic form if it exists
        this.removeAddQuoteForm();
        
        // Show notification
        this.showNotification('Quote added successfully!', 'success');
        
        // Update filter if category matches current selection
        if (this.selectedCategory === 'all' || this.selectedCategory === category) {
            this.currentQuoteIndex = this.quotes.length - 1;
            this.displayQuote(newQuote);
        }
        
        // Auto-sync with server if online
        if (this.isOnline) {
            await this.syncQuotes();
        }
    }
    
    showAddCategoryForm() {
        const newCategory = prompt('Enter new category name:');
        if (newCategory && newCategory.trim()) {
            // Add the new category to the dropdown
            const categoryFilter = document.getElementById('categoryFilter');
            const option = document.createElement('option');
            option.value = newCategory.trim();
            option.textContent = newCategory.trim();
            categoryFilter.insertBefore(option, categoryFilter.lastChild);
            categoryFilter.value = newCategory.trim();
            
            // Update filter
            this.filterQuotes();
            
            // Focus on add quote form
            this.createAddQuoteForm();
            document.getElementById('newQuoteCategory').value = newCategory.trim();
        } else {
            // Reset to previous selection
            categoryFilter.value = this.selectedCategory;
        }
    }
    
    // Task 2: Export quotes to JSON
    exportQuotes() {
        const data = {
            quotes: this.quotes,
            exportDate: new Date().toISOString(),
            count: this.quotes.length,
            categories: this.getUniqueCategories(),
            lastSync: this.lastSyncTime
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `quotes_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Revoke URL after download
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        this.showNotification(`Exported ${this.quotes.length} quotes successfully`, 'success');
    }
    
    // Task 2: Import quotes from JSON file
    importFromJsonFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.type !== 'application/json') {
            this.showNotification('Please select a JSON file', 'error');
            event.target.value = '';
            return;
        }
        
        const fileReader = new FileReader();
        
        fileReader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                let importedQuotes = [];
                
                // Handle different JSON structures
                if (Array.isArray(importedData)) {
                    importedQuotes = importedData;
                } else if (importedData.quotes && Array.isArray(importedData.quotes)) {
                    importedQuotes = importedData.quotes;
                } else {
                    throw new Error('Invalid JSON structure');
                }
                
                // Validate imported quotes
                const validQuotes = importedQuotes.filter(quote => 
                    quote.text && quote.category && 
                    typeof quote.text === 'string' && 
                    typeof quote.category === 'string'
                );
                
                if (validQuotes.length === 0) {
                    throw new Error('No valid quotes found in file');
                }
                
                // Add source and timestamps
                const enhancedQuotes = validQuotes.map(quote => ({
                    ...quote,
                    id: quote.id || Date.now() + Math.random(),
                    timestamp: quote.timestamp || Date.now(),
                    source: 'import',
                    pendingSync: true
                }));
                
                // Add quotes
                this.quotes.push(...enhancedQuotes);
                this.saveQuotes();
                this.populateCategories();
                
                this.showNotification(`${enhancedQuotes.length} quotes imported successfully!`, 'success');
                
                // Show random quote from imported data
                this.showRandomQuote();
                
                // Auto-sync if online
                if (this.isOnline) {
                    this.syncQuotes();
                }
                
            } catch (error) {
                this.showNotification('Error importing quotes: ' + error.message, 'error');
            }
        };
        
        fileReader.onerror = () => {
            this.showNotification('Error reading file', 'error');
        };
        
        fileReader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }
    
    // Task 4: Check online status
    checkOnlineStatus() {
        this.isOnline = navigator.onLine;
        
        // Update UI based on online status
        const syncButton = document.getElementById('syncData');
        if (syncButton) {
            if (this.isOnline) {
                syncButton.disabled = false;
                syncButton.innerHTML = '<i class="fas fa-sync"></i> Sync with Server';
            } else {
                syncButton.disabled = true;
                syncButton.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline';
            }
        }
        
        // Show notification
        if (this.isOnline) {
            this.showNotification('Back online! Syncing with server...', 'info');
            this.syncQuotes();
        } else {
            this.showNotification('You are offline. Changes will be saved locally.', 'warning');
        }
        
        this.updateStatistics();
    }
    
    // Task 4: fetchQuotesFromServer function with real API call
    async fetchQuotesFromServer() {
        if (!this.isOnline) {
            throw new Error('Cannot fetch from server: You are offline');
        }
        
        this.showNotification('Fetching quotes from server...', 'info');
        
        try {
            // Using JSONPlaceholder as a mock API
            const response = await fetch(`${this.serverUrl}/posts?_limit=5`);
            
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            
            const serverPosts = await response.json();
            
            // Convert posts to our quote format
            const serverQuotes = serverPosts.map((post, index) => ({
                text: post.title + (post.body ? ` - ${post.body.substring(0, 50)}...` : ''),
                category: ['Inspiration', 'Wisdom', 'Technology', 'Life', 'Motivation'][index % 5],
                id: `server_${post.id}`,
                serverId: post.id,
                timestamp: Date.now() - (index * 3600000), // Stagger timestamps
                source: 'server',
                pendingSync: false
            }));
            
            this.showNotification(`Fetched ${serverQuotes.length} quotes from server`, 'success');
            return serverQuotes;
            
        } catch (error) {
            console.error('Server fetch error:', error);
            throw new Error(`Failed to fetch from server: ${error.message}`);
        }
    }
    
    // Task 4: Post data to server using real API
    async postQuotesToServer(quotesToPost) {
        if (!this.isOnline) {
            throw new Error('Cannot post to server: You are offline');
        }
        
        if (quotesToPost.length === 0) {
            return { success: true, postedCount: 0 };
        }
        
        this.showNotification(`Posting ${quotesToPost.length} quotes to server...`, 'info');
        
        try {
            const postsToCreate = quotesToPost.filter(q => q.pendingSync && !q.serverId);
            let postedCount = 0;
            const errors = [];
            
            // Post each quote to the mock API
            for (const quote of postsToCreate) {
                try {
                    const response = await fetch(`${this.serverUrl}/posts`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: quote.text.substring(0, 50),
                            body: quote.text + ` [Category: ${quote.category}]`,
                            userId: 1
                        })
                    });
                    
                    if (response.ok) {
                        const serverResponse = await response.json();
                        
                        // Update local quote with server ID
                        const quoteIndex = this.quotes.findIndex(q => q.id === quote.id);
                        if (quoteIndex !== -1) {
                            this.quotes[quoteIndex].serverId = serverResponse.id;
                            this.quotes[quoteIndex].pendingSync = false;
                            this.quotes[quoteIndex].source = 'sync';
                            postedCount++;
                        }
                    } else {
                        errors.push(`Failed to post quote: ${quote.text.substring(0, 30)}...`);
                    }
                    
                    // Small delay to avoid overwhelming the mock API
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                } catch (error) {
                    errors.push(`Error posting quote: ${error.message}`);
                }
            }
            
            if (errors.length > 0) {
                console.warn('Some posts failed:', errors);
            }
            
            this.saveQuotes();
            return {
                success: errors.length === 0,
                postedCount,
                errors: errors.length > 0 ? errors : undefined
            };
            
        } catch (error) {
            console.error('Server post error:', error);
            throw new Error(`Failed to post to server: ${error.message}`);
        }
    }
    
    // Task 4: syncQuotes function - Complete sync implementation
    async syncQuotes() {
        if (!this.isOnline) {
            this.showNotification('Cannot sync: You are offline', 'warning');
            return;
        }
        
        try {
            this.showNotification('Starting sync with server...', 'info');
            
            // Create sync status indicator
            const syncStatus = document.createElement('div');
            syncStatus.className = 'sync-status';
            syncStatus.innerHTML = '<div class="loading"></div> Syncing...';
            document.getElementById('quoteDisplay').prepend(syncStatus);
            
            // 1. Fetch quotes from server
            const serverQuotes = await this.fetchQuotesFromServer();
            
            // 2. Post local quotes to server
            const pendingQuotes = this.quotes.filter(q => q.pendingSync);
            const postResult = await this.postQuotesToServer(pendingQuotes);
            
            // 3. Merge server quotes with local quotes
            const mergeResult = this.mergeServerQuotes(serverQuotes);
            
            // 4. Handle conflicts if any
            if (mergeResult.conflicts.length > 0) {
                this.showConflictModal(mergeResult.conflicts);
            }
            
            // 5. Update last sync time
            this.lastSyncTime = new Date();
            localStorage.setItem('lastSyncTime', this.lastSyncTime.toISOString());
            
            // Remove sync status
            syncStatus.remove();
            
            // Show comprehensive sync summary
            let summary = 'Sync completed! ';
            if (postResult.postedCount > 0) {
                summary += `Posted ${postResult.postedCount} quotes to server. `;
            }
            if (mergeResult.newQuotes.length > 0) {
                summary += `Added ${mergeResult.newQuotes.length} new quotes from server. `;
            }
            if (mergeResult.conflicts.length > 0) {
                summary += `Resolved ${mergeResult.conflicts.length} conflicts. `;
            }
            
            this.showNotification(summary || 'Sync completed (no changes)', 'success');
            
            // Update display
            this.updateStatistics();
            this.showRandomQuote();
            
        } catch (error) {
            this.showNotification(`Sync failed: ${error.message}`, 'error');
            console.error('Sync error:', error);
        }
    }
    
    // Task 4: Merge server quotes with conflict resolution
    mergeServerQuotes(serverQuotes) {
        const conflicts = [];
        const newQuotes = [];
        
        serverQuotes.forEach(serverQuote => {
            // Try to find by serverId first
            let localQuote = this.quotes.find(q => q.serverId === serverQuote.serverId);
            
            // If not found by serverId, try by text similarity
            if (!localQuote) {
                localQuote = this.quotes.find(q => 
                    q.text.toLowerCase().includes(serverQuote.text.substring(0, 20).toLowerCase()) ||
                    serverQuote.text.toLowerCase().includes(q.text.substring(0, 20).toLowerCase())
                );
            }
            
            if (localQuote) {
                // Check for conflict (different content)
                if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
                    conflicts.push({
                        id: serverQuote.id,
                        local: { ...localQuote },
                        server: serverQuote,
                        timestamp: new Date().toISOString()
                    });
                    
                    // By default, use server data if it's newer
                    if (serverQuote.timestamp > localQuote.timestamp) {
                        const index = this.quotes.findIndex(q => q.id === localQuote.id);
                        if (index !== -1) {
                            // Merge data, keeping server values
                            this.quotes[index] = {
                                ...this.quotes[index],
                                text: serverQuote.text,
                                category: serverQuote.category,
                                timestamp: serverQuote.timestamp,
                                source: 'sync'
                            };
                        }
                    }
                }
            } else {
                // New quote from server
                newQuotes.push(serverQuote);
                this.quotes.push(serverQuote);
            }
        });
        
        // Save changes
        if (conflicts.length > 0 || newQuotes.length > 0) {
            this.saveQuotes();
            this.populateCategories();
        }
        
        return { conflicts, newQuotes };
    }
    
    // Task 4: Start periodic sync
    startSyncInterval() {
        // Sync every 30 seconds for demonstration (in real app, this would be longer)
        this.syncInterval = setInterval(() => {
            if (this.isOnline) {
                this.syncQuotes();
            }
        }, 30000); // 30 seconds
        
        // Also sync on visibility change (when user returns to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isOnline) {
                this.syncQuotes();
            }
        });
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.checkOnlineStatus();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.checkOnlineStatus();
        });
    }
    
    // Task 4: Manual sync with server
    async syncWithServer() {
        await this.syncQuotes();
    }
    
    // Task 4: Enhanced Conflict resolution modal
    showConflictModal(conflicts) {
        const modal = document.getElementById('conflictModal');
        const message = document.getElementById('conflictMessage');
        
        if (conflicts.length === 0) return;
        
        message.innerHTML = `
            <div class="conflict-header">
                <i class="fas fa-exclamation-triangle fa-2x" style="color: #e74c3c;"></i>
                <h4>Data Conflicts Detected</h4>
            </div>
            <p><strong>Found ${conflicts.length} conflict(s) between local and server data:</strong></p>
            
            <div class="conflicts-list">
                ${conflicts.slice(0, 3).map((conflict, index) => `
                    <div class="conflict-item">
                        <div class="conflict-number">#${index + 1}</div>
                        <div class="conflict-details">
                            <div class="conflict-version local">
                                <strong><i class="fas fa-desktop"></i> Local:</strong>
                                <div class="quote-preview">"${conflict.local.text.substring(0, 60)}..."</div>
                                <small>Category: ${conflict.local.category} | Updated: ${new Date(conflict.local.timestamp).toLocaleTimeString()}</small>
                            </div>
                            <div class="conflict-version server">
                                <strong><i class="fas fa-server"></i> Server:</strong>
                                <div class="quote-preview">"${conflict.server.text.substring(0, 60)}..."</div>
                                <small>Category: ${conflict.server.category} | Updated: ${new Date(conflict.server.timestamp).toLocaleTimeString()}</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${conflicts.length > 3 ? 
                `<p class="more-conflicts">...and ${conflicts.length - 3} more conflict(s)</p>` : 
                ''
            }
            
            <p class="conflict-instruction">How would you like to resolve these conflicts?</p>
        `;
        
        modal.style.display = 'flex';
        
        // Set up conflict resolution buttons
        document.getElementById('useServerData').onclick = () => {
            conflicts.forEach(conflict => {
                const index = this.quotes.findIndex(q => q.id === conflict.local.id);
                if (index !== -1) {
                    this.quotes[index] = {
                        ...this.quotes[index],
                        text: conflict.server.text,
                        category: conflict.server.category,
                        timestamp: conflict.server.timestamp,
                        source: 'server'
                    };
                }
            });
            this.saveQuotes();
            this.showNotification(`Used server data for ${conflicts.length} conflicts`, 'info');
            modal.style.display = 'none';
            this.showRandomQuote();
        };
        
        document.getElementById('useLocalData').onclick = () => {
            conflicts.forEach(conflict => {
                const index = this.quotes.findIndex(q => q.id === conflict.local.id);
                if (index !== -1) {
                    this.quotes[index].pendingSync = true;
                }
            });
            this.saveQuotes();
            this.showNotification(`Keeping local data for ${conflicts.length} conflicts`, 'info');
            modal.style.display = 'none';
        };
        
        document.getElementById('mergeData').onclick = () => {
            conflicts.forEach(conflict => {
                const index = this.quotes.findIndex(q => q.id === conflict.local.id);
                if (index !== -1) {
                    // Merge: use server text if longer, otherwise keep local
                    const useServerText = conflict.server.text.length > conflict.local.text.length;
                    this.quotes[index] = {
                        ...this.quotes[index],
                        text: useServerText ? conflict.server.text : conflict.local.text,
                        category: conflict.server.category, // Always use server category
                        timestamp: Math.max(conflict.server.timestamp, conflict.local.timestamp),
                        source: 'merged'
                    };
                }
            });
            this.saveQuotes();
            this.showNotification(`Merged data for ${conflicts.length} conflicts`, 'success');
            modal.style.display = 'none';
            this.showRandomQuote();
        };
    }
    
    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'notification-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        notification.appendChild(timestamp);
        
        // Auto-hide after 5 seconds for info, 10 seconds for errors
        const hideTime = type === 'error' ? 10000 : 5000;
        setTimeout(() => {
            notification.style.display = 'none';
        }, hideTime);
        
        // Also log to console for debugging
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    // Initialize event listeners
    initializeEventListeners() {
        // Task 1 Requirement: "Show New Quote" button
        document.getElementById('newQuote').addEventListener('click', () => {
            this.showRandomQuote();
        });
        
        // Task 1: Add quote button (static form)
        document.getElementById('addQuoteBtn').addEventListener('click', () => {
            this.addQuote();
        });
        
        // Task 1: Create add quote form button
        const staticFormContainer = document.querySelector('.form-container');
        const createFormBtn = document.createElement('button');
        createFormBtn.className = 'btn secondary-btn';
        createFormBtn.innerHTML = '<i class="fas fa-plus-square"></i> Create Custom Form';
        createFormBtn.addEventListener('click', () => this.createAddQuoteForm());
        staticFormContainer.appendChild(createFormBtn);
        
        // Task 3: Category filter
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.filterQuotes();
        });
        
        // Clear filter button
        document.getElementById('clearFilter').addEventListener('click', () => {
            document.getElementById('categoryFilter').value = 'all';
            this.filterQuotes();
            this.showNotification('Filter cleared', 'info');
        });
        
        // Export quotes button
        document.getElementById('exportQuotes').addEventListener('click', () => {
            this.exportQuotes();
        });
        
        // Import quotes file input
        document.getElementById('importFile').addEventListener('change', (event) => {
            this.importFromJsonFile(event);
        });
        
        // Sync data button
        document.getElementById('syncData').addEventListener('click', () => {
            this.syncWithServer();
        });
        
        // Enter key in form inputs (static form)
        document.getElementById('newQuoteText')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.addQuote();
        });
        
        document.getElementById('newQuoteCategory')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.addQuote();
        });
        
        // Close modal when clicking outside
        const modal = document.getElementById('conflictModal');
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                this.showNotification('Conflict resolution cancelled', 'warning');
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N for new quote
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.showRandomQuote();
            }
            
            // Ctrl/Cmd + S for sync
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.syncWithServer();
            }
            
            // Ctrl/Cmd + A for add quote form
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                this.createAddQuoteForm();
            }
            
            // Escape to close modal
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                this.showNotification('Conflict resolution cancelled', 'warning');
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuoteGenerator();
    
    // Make app available globally for debugging
    window.quoteApp = app;
    
    console.log('Dynamic Quote Generator initialized successfully!');
    console.log('Server URL:', app.serverUrl);
    console.log('Keyboard shortcuts:');
    console.log('- Ctrl/Cmd + N: Show new random quote');
    console.log('- Ctrl/Cmd + S: Sync with server');
    console.log('- Ctrl/Cmd + A: Open add quote form');
    console.log('- Escape: Close conflict modal');
});