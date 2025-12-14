// Quote Generator Application with Advanced Features

class QuoteGenerator {
    constructor() {
        this.quotes = [];
        this.currentQuoteIndex = 0;
        this.selectedCategory = 'all';
        this.lastSyncTime = null;
        this.syncInterval = null;
        
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
        
        // Start periodic sync (simulated)
        this.startSyncInterval();
        
        // Update statistics
        this.updateStatistics();
    }
    
    // Default quotes if storage is empty
    getDefaultQuotes() {
        return [
            {
                text: "The only way to do great work is to love what you do.",
                category: "Inspiration",
                id: 1,
                timestamp: Date.now() - 86400000
            },
            {
                text: "Innovation distinguishes between a leader and a follower.",
                category: "Leadership",
                id: 2,
                timestamp: Date.now() - 172800000
            },
            {
                text: "Your time is limited, so don't waste it living someone else's life.",
                category: "Wisdom",
                id: 3,
                timestamp: Date.now() - 259200000
            },
            {
                text: "Stay hungry, stay foolish.",
                category: "Motivation",
                id: 4,
                timestamp: Date.now() - 345600000
            },
            {
                text: "The future belongs to those who believe in the beauty of their dreams.",
                category: "Dreams",
                id: 5,
                timestamp: Date.now() - 432000000
            }
        ];
    }
    
    // Load quotes from local storage
    loadQuotesFromStorage() {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            this.quotes = JSON.parse(storedQuotes);
            this.showNotification('Quotes loaded from local storage');
        } else {
            this.quotes = this.getDefaultQuotes();
            this.saveQuotes();
            this.showNotification('Default quotes loaded');
        }
    }
    
    // Save quotes to local storage
    saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(this.quotes));
        sessionStorage.setItem('lastUpdate', new Date().toISOString());
        this.updateStatistics();
        this.showNotification('Quotes saved successfully');
    }
    
    // Update statistics display
    updateStatistics() {
        document.getElementById('totalQuotes').textContent = this.quotes.length;
        document.getElementById('totalCategories').textContent = this.getUniqueCategories().length;
        document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
        document.getElementById('storageStatus').textContent = 'Local';
    }
    
    // Get unique categories
    getUniqueCategories() {
        const categories = this.quotes.map(quote => quote.category);
        return [...new Set(categories)];
    }
    
    // Populate categories in dropdown
    populateCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        const uniqueCategories = this.getUniqueCategories();
        
        // Clear existing options except "All Categories"
        while (categoryFilter.options.length > 1) {
            categoryFilter.remove(1);
        }
        
        // Add category options
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    // Show random quote
    showRandomQuote() {
        if (this.quotes.length === 0) {
            this.showNotification('No quotes available');
            return;
        }
        
        let filteredQuotes = this.quotes;
        if (this.selectedCategory !== 'all') {
            filteredQuotes = this.quotes.filter(quote => quote.category === this.selectedCategory);
        }
        
        if (filteredQuotes.length === 0) {
            this.showNotification('No quotes in selected category');
            return;
        }
        
        this.currentQuoteIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[this.currentQuoteIndex];
        
        this.displayQuote(quote);
        
        // Store last viewed quote in session storage
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
        
        this.showNotification('New quote displayed');
    }
    
    // Display quote in the UI
    displayQuote(quote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quoteCategory = document.getElementById('quoteCategory');
        const quoteCounter = document.getElementById('quoteCounter');
        
        quoteDisplay.innerHTML = `
            <div class="quote-text">
                <i class="fas fa-quote-left fa-lg" style="color: #667eea; margin-right: 10px;"></i>
                ${quote.text}
                <i class="fas fa-quote-right fa-lg" style="color: #667eea; margin-left: 10px;"></i>
            </div>
        `;
        
        quoteCategory.textContent = quote.category;
        quoteCounter.textContent = `Quote ${this.currentQuoteIndex + 1} of ${this.quotes.length}`;
    }
    
    // Filter quotes by category
    filterQuotes() {
        const categoryFilter = document.getElementById('categoryFilter');
        this.selectedCategory = categoryFilter.value;
        
        // Save filter preference
        localStorage.setItem('lastCategoryFilter', this.selectedCategory);
        
        // Show random quote from filtered category
        this.showRandomQuote();
    }
    
    // Load last selected filter
    loadLastFilter() {
        const lastFilter = localStorage.getItem('lastCategoryFilter');
        if (lastFilter) {
            document.getElementById('categoryFilter').value = lastFilter;
            this.selectedCategory = lastFilter;
        }
    }
    
    // Add new quote
    addQuote() {
        const textInput = document.getElementById('newQuoteText');
        const categoryInput = document.getElementById('newQuoteCategory');
        
        const text = textInput.value.trim();
        const category = categoryInput.value.trim();
        
        if (!text || !category) {
            this.showNotification('Please enter both quote text and category', 'error');
            return;
        }
        
        const newQuote = {
            text: text,
            category: category,
            id: Date.now(),
            timestamp: Date.now()
        };
        
        this.quotes.push(newQuote);
        this.saveQuotes();
        
        // Update categories dropdown
        this.populateCategories();
        
        // Clear inputs
        textInput.value = '';
        categoryInput.value = '';
        
        // Show notification
        this.showNotification('Quote added successfully!');
        
        // Update filter if category matches current selection
        if (this.selectedCategory === 'all' || this.selectedCategory === category) {
            this.currentQuoteIndex = this.quotes.length - 1;
            this.displayQuote(newQuote);
        }
    }
    
    // Export quotes to JSON
    exportQuotes() {
        const dataStr = JSON.stringify(this.quotes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `quotes_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Quotes exported successfully');
    }
    
    // Import quotes from JSON file
    importFromJsonFile(event) {
        const fileReader = new FileReader();
        
        fileReader.onload = (e) => {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                
                // Validate imported data
                if (!Array.isArray(importedQuotes)) {
                    throw new Error('Invalid data format');
                }
                
                // Add imported quotes
                this.quotes.push(...importedQuotes);
                this.saveQuotes();
                this.populateCategories();
                
                this.showNotification(`${importedQuotes.length} quotes imported successfully!`);
                
                // Show random quote from imported data
                this.showRandomQuote();
                
            } catch (error) {
                this.showNotification('Error importing quotes: ' + error.message, 'error');
            }
        };
        
        fileReader.readAsText(event.target.files[0]);
        
        // Reset file input
        event.target.value = '';
    }
    
    // Simulate server sync
    async syncWithServer() {
        try {
            this.showNotification('Syncing with server...', 'info');
            
            // Simulate server response with mock data
            const serverQuotes = await this.fetchFromMockServer();
            
            // Check for conflicts
            const conflicts = this.detectConflicts(serverQuotes);
            
            if (conflicts.length > 0) {
                this.showConflictModal(conflicts, serverQuotes);
            } else {
                // No conflicts, update local data
                this.quotes = serverQuotes;
                this.saveQuotes();
                this.populateCategories();
                this.showNotification('Data synced successfully');
            }
            
            this.lastSyncTime = new Date();
            this.updateStatistics();
            
        } catch (error) {
            this.showNotification('Sync failed: ' + error.message, 'error');
        }
    }
    
    // Fetch from mock server (simulated)
    async fetchFromMockServer() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate server data (in real app, this would be from an API)
                const serverQuotes = [
                    ...this.quotes.map(q => ({ ...q })),
                    // Add some "new" quotes from server
                    {
                        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
                        category: "Wisdom",
                        id: Date.now() + 1,
                        timestamp: Date.now() - 3600000
                    },
                    {
                        text: "Don't watch the clock; do what it does. Keep going.",
                        category: "Motivation",
                        id: Date.now() + 2,
                        timestamp: Date.now() - 7200000
                    }
                ];
                resolve(serverQuotes);
            }, 1000);
        });
    }
    
    // Detect conflicts between local and server data
    detectConflicts(serverQuotes) {
        const conflicts = [];
        
        this.quotes.forEach(localQuote => {
            const serverQuote = serverQuotes.find(sq => sq.id === localQuote.id);
            if (serverQuote && serverQuote.timestamp > localQuote.timestamp) {
                conflicts.push({
                    id: localQuote.id,
                    local: localQuote,
                    server: serverQuote
                });
            }
        });
        
        return conflicts;
    }
    
    // Show conflict resolution modal
    showConflictModal(conflicts, serverQuotes) {
        const modal = document.getElementById('conflictModal');
        const message = document.getElementById('conflictMessage');
        
        message.textContent = `Found ${conflicts.length} conflict(s) between local and server data.`;
        
        modal.style.display = 'flex';
        
        // Set up conflict resolution buttons
        document.getElementById('useServerData').onclick = () => {
            this.resolveConflicts('server', serverQuotes);
            modal.style.display = 'none';
        };
        
        document.getElementById('useLocalData').onclick = () => {
            this.resolveConflicts('local', serverQuotes);
            modal.style.display = 'none';
        };
        
        document.getElementById('mergeData').onclick = () => {
            this.resolveConflicts('merge', serverQuotes);
            modal.style.display = 'none';
        };
    }
    
    // Resolve conflicts based on user choice
    resolveConflicts(resolution, serverQuotes) {
        switch (resolution) {
            case 'server':
                this.quotes = serverQuotes;
                this.showNotification('Using server data');
                break;
            case 'local':
                // Keep local data, add new server quotes
                const localIds = new Set(this.quotes.map(q => q.id));
                const newServerQuotes = serverQuotes.filter(q => !localIds.has(q.id));
                this.quotes.push(...newServerQuotes);
                this.showNotification('Keeping local data, adding new server quotes');
                break;
            case 'merge':
                // Merge both datasets, preferring newer versions
                const mergedQuotes = [...serverQuotes];
                this.quotes.forEach(localQuote => {
                    const existing = mergedQuotes.find(q => q.id === localQuote.id);
                    if (!existing) {
                        mergedQuotes.push(localQuote);
                    }
                });
                this.quotes = mergedQuotes;
                this.showNotification('Merged local and server data');
                break;
        }
        
        this.saveQuotes();
        this.populateCategories();
        this.showRandomQuote();
    }
    
    // Start periodic sync interval
    startSyncInterval() {
        // Sync every 5 minutes (300000 ms)
        this.syncInterval = setInterval(() => {
            this.syncWithServer();
        }, 300000);
    }
    
    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        
        // Set color based on type
        switch (type) {
            case 'error':
                notification.style.background = '#e74c3c';
                break;
            case 'info':
                notification.style.background = '#3498db';
                break;
            case 'warning':
                notification.style.background = '#f39c12';
                break;
            default:
                notification.style.background = '#2ecc71';
        }
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // Initialize event listeners
    initializeEventListeners() {
        // New quote button
        document.getElementById('newQuote').addEventListener('click', () => {
            this.showRandomQuote();
        });
        
        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.filterQuotes();
        });
        
        // Clear filter button
        document.getElementById('clearFilter').addEventListener('click', () => {
            document.getElementById('categoryFilter').value = 'all';
            this.filterQuotes();
        });
        
        // Add quote button
        document.getElementById('addQuoteBtn').addEventListener('click', () => {
            this.addQuote();
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
        
        // Enter key in form inputs
        document.getElementById('newQuoteText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addQuote();
        });
        
        document.getElementById('newQuoteCategory').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addQuote();
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuoteGenerator();
});