# ForecastAI SaaS Platform - UI/UX Design System (Part 2)
### Pages 5.4-5.7, Animations, and Implementation

---

## 5.4 Data Upload & Management Page

**URL:** `/data`  
**Purpose:** Upload CSV files, manage datasets, view preprocessing status  

### Layout Structure

```
┌──────────────────────────────────────────────────────┐
│ SIDEBAR │  Data Management                           │
├─────────┼────────────────────────────────────────────┤
│         │ ┌─────────────────────────────────────────┐│
│         │ │  UPLOAD ZONE (Drag & Drop)              ││
│         │ │  Drop CSV files here or click to browse││
│         │ └─────────────────────────────────────────┘│
│         ├────────────────────────────────────────────┤
│         │  Uploaded Datasets                         │
│         │  ┌──────────────────────────────────────┐ │
│         │  │ Dataset 1  │ Size │ Date │ Actions  │ │
│         │  │ Dataset 2  │ ...  │ ...  │ [•••]    │ │
│         │  └──────────────────────────────────────┘ │
│         ├────────────────────────────────────────────┤
│         │  Data Preview & Statistics                 │
│         │  [Interactive Table + Charts]              │
└─────────┴────────────────────────────────────────────┘
```

### Upload Component

```html
<div class="data-upload-page">
  
  <!-- Upload Zone -->
  <section class="upload-section">
    <div class="upload-zone" id="dropzone">
      <div class="upload-icon">
        <svg>📁</svg>
      </div>
      <h3 class="upload-title">Upload Your Dataset</h3>
      <p class="upload-description">
        Drag and drop CSV files here, or click to browse
      </p>
      <div class="upload-requirements">
        <span class="requirement">✓ CSV format</span>
        <span class="requirement">✓ Max 500 MB</span>
        <span class="requirement">✓ UTF-8 encoding</span>
      </div>
      <input 
        type="file" 
        id="file-input" 
        accept=".csv" 
        multiple 
        hidden 
      />
      <button class="btn-primary" onclick="document.getElementById('file-input').click()">
        Choose Files
      </button>
    </div>
  </section>
  
  <!-- Upload Progress (appears during upload) -->
  <div class="upload-progress" id="upload-progress" hidden>
    <div class="upload-progress-header">
      <div class="upload-filename">walmart_sales_2024.csv</div>
      <div class="upload-size">45 MB</div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 65%;">
        <div class="progress-percentage">65%</div>
      </div>
    </div>
    <div class="upload-status">
      Uploading... <span class="upload-eta">12s remaining</span>
    </div>
  </div>
  
  <!-- Datasets Table -->
  <section class="datasets-section">
    <div class="section-header">
      <h2 class="section-title">Your Datasets</h2>
      <div class="section-actions">
        <div class="search-box">
          <svg class="search-icon">🔍</svg>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search datasets..."
          />
        </div>
        <select class="filter-select">
          <option>All Files</option>
          <option>Recent</option>
          <option>Favorites</option>
        </select>
      </div>
    </div>
    
    <div class="datasets-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Name</th>
            <th>Size</th>
            <th>Rows</th>
            <th>Columns</th>
            <th>Uploaded</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" /></td>
            <td>
              <div class="dataset-name">
                <svg class="file-icon">📄</svg>
                <div>
                  <div class="name-text">walmart_sales_2024.csv</div>
                  <div class="name-path">/uploads/walmart/</div>
                </div>
              </div>
            </td>
            <td><span class="mono-text">45.2 MB</span></td>
            <td><span class="mono-text">421,570</span></td>
            <td><span class="mono-text">15</span></td>
            <td><span class="date-text">2 hours ago</span></td>
            <td>
              <span class="badge badge-success">Ready</span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon btn-sm" title="Preview">
                  <svg>👁</svg>
                </button>
                <button class="btn-icon btn-sm" title="Download">
                  <svg>↓</svg>
                </button>
                <button class="btn-icon btn-sm" title="More">
                  <svg>⋯</svg>
                </button>
              </div>
            </td>
          </tr>
          
          <tr>
            <td><input type="checkbox" /></td>
            <td>
              <div class="dataset-name">
                <svg class="file-icon">📄</svg>
                <div>
                  <div class="name-text">features_external.csv</div>
                  <div class="name-path">/uploads/walmart/</div>
                </div>
              </div>
            </td>
            <td><span class="mono-text">8.1 MB</span></td>
            <td><span class="mono-text">143</span></td>
            <td><span class="mono-text">12</span></td>
            <td><span class="date-text">1 day ago</span></td>
            <td>
              <span class="badge badge-warning">Processing</span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon btn-sm" title="Preview" disabled>
                  <svg>👁</svg>
                </button>
                <button class="btn-icon btn-sm" title="Download">
                  <svg>↓</svg>
                </button>
                <button class="btn-icon btn-sm" title="More">
                  <svg>⋯</svg>
                </button>
              </div>
            </td>
          </tr>
          
          <!-- More rows... -->
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div class="pagination">
      <div class="pagination-info">
        Showing 1-10 of 42 datasets
      </div>
      <div class="pagination-controls">
        <button class="btn-icon" disabled>
          <svg>‹</svg>
        </button>
        <button class="page-number active">1</button>
        <button class="page-number">2</button>
        <button class="page-number">3</button>
        <span>...</span>
        <button class="page-number">5</button>
        <button class="btn-icon">
          <svg>›</svg>
        </button>
      </div>
    </div>
  </section>
  
  <!-- Data Preview Modal (shown on preview click) -->
  <div class="modal" id="preview-modal" hidden>
    <div class="modal-overlay" onclick="closeModal()"></div>
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3 class="modal-title">walmart_sales_2024.csv</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <!-- Statistics Cards -->
        <div class="preview-stats">
          <div class="stat-card">
            <div class="stat-label">Total Rows</div>
            <div class="stat-value">421,570</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Columns</div>
            <div class="stat-value">15</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Missing Values</div>
            <div class="stat-value">2.3%</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">File Size</div>
            <div class="stat-value">45.2 MB</div>
          </div>
        </div>
        
        <!-- Data Table Preview -->
        <div class="preview-table">
          <table class="data-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Dept</th>
                <th>Date</th>
                <th>Weekly_Sales</th>
                <th>IsHoliday</th>
                <th>Temperature</th>
                <!-- More columns... -->
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>1</td>
                <td>2010-02-05</td>
                <td>$24,924.50</td>
                <td>False</td>
                <td>42.31</td>
              </tr>
              <!-- More rows... -->
            </tbody>
          </table>
        </div>
        
        <!-- Column Info -->
        <div class="column-info">
          <h4>Column Information</h4>
          <div class="column-list">
            <div class="column-item">
              <div class="column-header">
                <span class="column-name">Weekly_Sales</span>
                <span class="column-type">float64</span>
              </div>
              <div class="column-stats">
                <span>Mean: $15,981.26</span>
                <span>Std: $22,711.18</span>
                <span>Min: -$4,988.94</span>
                <span>Max: $693,099.36</span>
              </div>
            </div>
            <!-- More columns... -->
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeModal()">Close</button>
        <button class="btn-primary">Use This Dataset</button>
      </div>
    </div>
  </div>
  
</div>
```

### Styling for Data Management

```css
/* === UPLOAD ZONE === */
.upload-section {
  margin-bottom: var(--space-12);
}

.upload-zone {
  background: var(--bg-secondary);
  border: 2px dashed var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-16);
  text-align: center;
  transition: all var(--duration-base);
  cursor: pointer;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: var(--accent-blue);
  background: rgba(74, 158, 255, 0.05);
}

.upload-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-6);
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.upload-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.upload-description {
  color: var(--text-secondary);
  font-size: var(--text-lg);
  margin-bottom: var(--space-6);
}

.upload-requirements {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.requirement {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

/* === UPLOAD PROGRESS === */
.upload-progress {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}

.upload-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.upload-filename {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.upload-size {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
}

.upload-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.upload-eta {
  font-family: var(--font-mono);
  color: var(--accent-blue);
}

/* === DATASETS TABLE === */
.datasets-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.section-actions {
  display: flex;
  gap: var(--space-3);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--space-3);
  width: 18px;
  height: 18px;
  color: var(--text-tertiary);
  pointer-events: none;
}

.search-input {
  padding-left: var(--space-10);
  width: 300px;
}

.filter-select {
  min-width: 150px;
}

.dataset-name {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.file-icon {
  width: 32px;
  height: 32px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.name-text {
  font-weight: var(--font-medium);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.name-path {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

.mono-text {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.date-text {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.action-buttons {
  display: flex;
  gap: var(--space-2);
}

.btn-sm {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

/* === PAGINATION === */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-primary);
}

.pagination-info {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.pagination-controls {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.page-number:hover {
  border-color: var(--accent-blue);
  background: rgba(74, 158, 255, 0.05);
}

.page-number.active {
  background: var(--accent-blue);
  color: white;
  border-color: var(--accent-blue);
}

/* === MODAL === */
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 14, 26, 0.85);
  backdrop-filter: blur(8px);
}

.modal-content {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  overflow: auto;
  width: 100%;
  max-width: 900px;
}

.modal-large {
  max-width: 1200px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-primary);
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.modal-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.modal-close:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-6);
  border-top: 1px solid var(--border-primary);
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.stat-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--accent-blue);
}

.preview-table {
  max-height: 400px;
  overflow: auto;
  margin-bottom: var(--space-6);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
}

.column-info {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.column-info h4 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.column-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.column-item {
  padding: var(--space-4);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.column-name {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.column-type {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--accent-purple);
  background: rgba(183, 148, 246, 0.15);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

.column-stats {
  display: flex;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-family: var(--font-mono);
}
```

### JavaScript - Drag & Drop Upload

```javascript
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const uploadProgress = document.getElementById('upload-progress');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, () => {
    dropzone.classList.add('drag-over');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, () => {
    dropzone.classList.remove('drag-over');
  }, false);
});

// Handle dropped files
dropzone.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  handleFiles(files);
}, false);

// Handle file input change
fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  handleFiles(files);
});

function handleFiles(files) {
  [...files].forEach(uploadFile);
}

function uploadFile(file) {
  // Validate file type
  if (!file.name.endsWith('.csv')) {
    showError('Please upload CSV files only');
    return;
  }
  
  // Validate file size (max 500 MB)
  if (file.size > 500 * 1024 * 1024) {
    showError('File size must be less than 500 MB');
    return;
  }
  
  // Show upload progress
  uploadProgress.hidden = false;
  
  // Create FormData
  const formData = new FormData();
  formData.append('file', file);
  
  // Upload with progress tracking
  const xhr = new XMLHttpRequest();
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      updateProgress(percentComplete);
    }
  });
  
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      onUploadSuccess(response);
    } else {
      showError('Upload failed');
    }
  });
  
  xhr.addEventListener('error', () => {
    showError('Network error occurred');
  });
  
  xhr.open('POST', '/api/upload');
  xhr.send(formData);
}

function updateProgress(percent) {
  const progressFill = uploadProgress.querySelector('.progress-fill');
  const progressPercentage = uploadProgress.querySelector('.progress-percentage');
  
  progressFill.style.width = `${percent}%`;
  progressPercentage.textContent = `${Math.round(percent)}%`;
  
  // Estimate time remaining
  // ... implementation
}

function onUploadSuccess(data) {
  // Hide progress
  setTimeout(() => {
    uploadProgress.hidden = true;
    // Add new row to table
    addDatasetToTable(data);
    // Show success notification
    showNotification('Dataset uploaded successfully!', 'success');
  }, 500);
}

function showError(message) {
  showNotification(message, 'error');
}

function showNotification(message, type) {
  // Create toast notification
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after 3s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
```

---

## 5.5 Model Training & Configuration Page

**URL:** `/models`  
**Purpose:** Configure, train, and manage ML models  

### Layout

```
┌──────────────────────────────────────────────────────┐
│ SIDEBAR │  Model Training                            │
├─────────┼────────────────────────────────────────────┤
│         │ ┌──────────────┐ ┌──────────────┐         │
│         │ │ Select Model │ │ Parameters   │         │
│         │ │ [Dropdown]   │ │ [Form]       │         │
│         │ └──────────────┘ └──────────────┘         │
│         ├────────────────────────────────────────────┤
│         │  Training Progress (Live Updates)         │
│         │  [Progress Bar + Metrics Charts]          │
│         ├────────────────────────────────────────────┤
│         │  Model Comparison Table                    │
│         │  [Accuracy, MAE, RMSE for each model]      │
└─────────┴────────────────────────────────────────────┘
```

```html
<div class="model-training-page">
  
  <!-- Model Selection & Configuration -->
  <section class="config-section">
    <div class="config-grid">
      
      <!-- Model Selection Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Select Model</h3>
        </div>
        <div class="card-body">
          <div class="model-selector">
            
            <label class="model-option">
              <input type="radio" name="model" value="xgboost" checked />
              <div class="model-card">
                <div class="model-icon">
                  <svg>🚀</svg>
                </div>
                <div class="model-info">
                  <div class="model-name">XGBoost</div>
                  <div class="model-description">
                    Gradient boosting. Best for tabular data.
                  </div>
                  <div class="model-badge badge-success">Recommended</div>
                </div>
                <div class="model-stats">
                  <div class="stat-small">
                    <span class="stat-label">Accuracy</span>
                    <span class="stat-value">97.2%</span>
                  </div>
                  <div class="stat-small">
                    <span class="stat-label">Speed</span>
                    <span class="stat-value">Fast</span>
                  </div>
                </div>
              </div>
            </label>
            
            <label class="model-option">
              <input type="radio" name="model" value="lstm" />
              <div class="model-card">
                <div class="model-icon">
                  <svg>🧠</svg>
                </div>
                <div class="model-info">
                  <div class="model-name">LSTM</div>
                  <div class="model-description">
                    Deep learning. Captures temporal patterns.
                  </div>
                </div>
                <div class="model-stats">
                  <div class="stat-small">
                    <span class="stat-label">Accuracy</span>
                    <span class="stat-value">96.8%</span>
                  </div>
                  <div class="stat-small">
                    <span class="stat-label">Speed</span>
                    <span class="stat-value">Slow</span>
                  </div>
                </div>
              </div>
            </label>
            
            <label class="model-option">
              <input type="radio" name="model" value="prophet" />
              <div class="model-card">
                <div class="model-icon">
                  <svg>📈</svg>
                </div>
                <div class="model-info">
                  <div class="model-name">Prophet</div>
                  <div class="model-description">
                    Time series. Handles seasonality well.
                  </div>
                </div>
                <div class="model-stats">
                  <div class="stat-small">
                    <span class="stat-label">Accuracy</span>
                    <span class="stat-value">95.4%</span>
                  </div>
                  <div class="stat-small">
                    <span class="stat-label">Speed</span>
                    <span class="stat-value">Medium</span>
                  </div>
                </div>
              </div>
            </label>
            
            <label class="model-option">
              <input type="radio" name="model" value="ensemble" />
              <div class="model-card">
                <div class="model-icon">
                  <svg>🎯</svg>
                </div>
                <div class="model-info">
                  <div class="model-name">Ensemble</div>
                  <div class="model-description">
                    Combines all models for best accuracy.
                  </div>
                  <div class="model-badge badge-warning">Advanced</div>
                </div>
                <div class="model-stats">
                  <div class="stat-small">
                    <span class="stat-label">Accuracy</span>
                    <span class="stat-value">98.77%</span>
                  </div>
                  <div class="stat-small">
                    <span class="stat-label">Speed</span>
                    <span class="stat-value">Slow</span>
                  </div>
                </div>
              </div>
            </label>
            
          </div>
        </div>
      </div>
      
      <!-- Parameters Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Hyperparameters</h3>
          <button class="btn-secondary btn-sm">Reset Defaults</button>
        </div>
        <div class="card-body">
          <form class="param-form">
            
            <!-- Dataset Selection -->
            <div class="form-group">
              <label>Training Dataset</label>
              <select class="input-field">
                <option>walmart_sales_2024.csv</option>
                <option>walmart_sales_2023.csv</option>
              </select>
            </div>
            
            <!-- XGBoost Parameters (shown conditionally) -->
            <div class="form-group">
              <label>
                Max Depth
                <span class="param-info" title="Maximum tree depth">ℹ</span>
              </label>
              <div class="slider-input">
                <input 
                  type="range" 
                  min="3" 
                  max="10" 
                  value="6" 
                  class="slider"
                  id="max-depth"
                />
                <span class="slider-value">6</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>
                Learning Rate
                <span class="param-info" title="Step size shrinkage">ℹ</span>
              </label>
              <div class="slider-input">
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.3" 
                  step="0.01"
                  value="0.1" 
                  class="slider"
                  id="learning-rate"
                />
                <span class="slider-value">0.1</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>
                Number of Estimators
                <span class="param-info" title="Number of trees">ℹ</span>
              </label>
              <input 
                type="number" 
                class="input-field" 
                value="100"
                min="10"
                max="1000"
              />
            </div>
            
            <!-- Train/Val Split -->
            <div class="form-group">
              <label>Train / Validation Split</label>
              <div class="split-selector">
                <button type="button" class="split-btn active">80/20</button>
                <button type="button" class="split-btn">70/30</button>
                <button type="button" class="split-btn">Custom</button>
              </div>
            </div>
            
            <!-- Advanced Options (Collapsible) -->
            <details class="advanced-options">
              <summary>Advanced Options</summary>
              <div class="advanced-content">
                <div class="form-group">
                  <label>Random Seed</label>
                  <input type="number" class="input-field" value="42" />
                </div>
                <div class="form-group">
                  <label>Early Stopping Rounds</label>
                  <input type="number" class="input-field" value="10" />
                </div>
                <div class="form-group checkbox-group">
                  <input type="checkbox" id="gpu" />
                  <label for="gpu">Use GPU Acceleration</label>
                </div>
              </div>
            </details>
            
          </form>
        </div>
        <div class="card-footer">
          <button class="btn-primary btn-full">
            <svg>▶</svg>
            Start Training
          </button>
        </div>
      </div>
      
    </div>
  </section>
  
  <!-- Training Progress (shown during training) -->
  <section class="training-section" id="training-section" hidden>
    <div class="card">
      <div class="card-header">
        <div class="card-title-group">
          <h3 class="card-title">Training in Progress</h3>
          <p class="card-subtitle">XGBoost - Epoch 45/100</p>
        </div>
        <button class="btn-secondary btn-sm">
          <svg>⏸</svg>
          Pause
        </button>
      </div>
      <div class="card-body">
        
        <!-- Overall Progress -->
        <div class="training-progress">
          <div class="progress-header">
            <span class="progress-label">Overall Progress</span>
            <span class="progress-percentage">45%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 45%;">
              <div class="progress-shimmer"></div>
            </div>
          </div>
          <div class="progress-footer">
            <span class="eta">⏱ ETA: 8 min 32s</span>
            <span class="elapsed">Elapsed: 6 min 14s</span>
          </div>
        </div>
        
        <!-- Live Metrics -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-label">Training Loss</div>
              <div class="metric-value">0.0234</div>
              <div class="metric-change positive">↓ 12.5%</div>
            </div>
            <div class="metric-sparkline">
              <canvas id="train-loss-spark"></canvas>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">✓</div>
            <div class="metric-content">
              <div class="metric-label">Val Accuracy</div>
              <div class="metric-value">96.8%</div>
              <div class="metric-change positive">↑ 2.1%</div>
            </div>
            <div class="metric-sparkline">
              <canvas id="val-acc-spark"></canvas>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🎯</div>
            <div class="metric-content">
              <div class="metric-label">MAE</div>
              <div class="metric-value">$189</div>
              <div class="metric-change negative">↓ 8.3%</div>
            </div>
            <div class="metric-sparkline">
              <canvas id="mae-spark"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Training Chart -->
        <div class="training-chart">
          <canvas id="training-chart"></canvas>
        </div>
        
        <!-- Console Logs -->
        <div class="console-logs">
          <div class="console-header">
            <span class="console-title">Training Logs</span>
            <button class="btn-icon btn-sm">
              <svg>↓</svg>
            </button>
          </div>
          <div class="console-content">
            <div class="log-line">
              <span class="log-time">[14:32:45]</span>
              <span class="log-level info">INFO</span>
              <span class="log-message">Epoch 45/100 - loss: 0.0234 - val_acc: 0.968</span>
            </div>
            <div class="log-line">
              <span class="log-time">[14:32:38]</span>
              <span class="log-level info">INFO</span>
              <span class="log-message">Epoch 44/100 - loss: 0.0241 - val_acc: 0.965</span>
            </div>
            <div class="log-line">
              <span class="log-time">[14:32:31]</span>
              <span class="log-level warn">WARN</span>
              <span class="log-message">Validation loss increased. Early stopping: 1/10</span>
            </div>
            <!-- More logs... -->
          </div>
        </div>
        
      </div>
    </div>
  </section>
  
  <!-- Model Comparison -->
  <section class="comparison-section">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Model Comparison</h3>
        <div class="card-actions">
          <button class="btn-secondary btn-sm">Export Results</button>
          <button class="btn-secondary btn-sm">
            <svg>↻</svg>
            Refresh
          </button>
        </div>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Version</th>
              <th>Accuracy</th>
              <th>MAPE</th>
              <th>MAE</th>
              <th>RMSE</th>
              <th>Training Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="table-row-highlight">
              <td>
                <div class="model-name-cell">
                  <svg class="model-icon-sm">🎯</svg>
                  <strong>Ensemble</strong>
                </div>
              </td>
              <td><span class="mono-text">v2.3</span></td>
              <td><span class="metric-good">98.77%</span></td>
              <td><span class="mono-text">1.23%</span></td>
              <td><span class="mono-text">$176</span></td>
              <td><span class="mono-text">$245</span></td>
              <td><span class="mono-text">15m 24s</span></td>
              <td><span class="badge badge-success">Active</span></td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-sm" title="Details">📊</button>
                  <button class="btn-icon btn-sm" title="Deploy">🚀</button>
                  <button class="btn-icon btn-sm" title="More">⋯</button>
                </div>
              </td>
            </tr>
            
            <tr>
              <td>
                <div class="model-name-cell">
                  <svg class="model-icon-sm">🚀</svg>
                  XGBoost
                </div>
              </td>
              <td><span class="mono-text">v2.1</span></td>
              <td><span class="metric-good">97.2%</span></td>
              <td><span class="mono-text">2.8%</span></td>
              <td><span class="mono-text">$198</span></td>
              <td><span class="mono-text">$267</span></td>
              <td><span class="mono-text">8m 12s</span></td>
              <td><span class="badge">Archived</span></td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-sm">📊</button>
                  <button class="btn-icon btn-sm">🚀</button>
                  <button class="btn-icon btn-sm">⋯</button>
                </div>
              </td>
            </tr>
            
            <!-- More rows... -->
          </tbody>
        </table>
      </div>
    </div>
  </section>
  
</div>
```

### Styling for Model Training

```css
/* === CONFIG SECTION === */
.config-section {
  margin-bottom: var(--space-12);
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

/* === MODEL SELECTOR === */
.model-selector {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.model-option input[type="radio"] {
  display: none;
}

.model-card {
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  cursor: pointer;
  transition: all var(--duration-base);
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: var(--space-4);
}

.model-option input[type="radio"]:checked + .model-card {
  border-color: var(--accent-blue);
  background: rgba(74, 158, 255, 0.08);
}

.model-card:hover {
  border-color: rgba(74, 158, 255, 0.5);
  transform: translateX(4px);
}

.model-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  grid-row: span 2;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.model-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.model-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.model-badge {
  align-self: flex-start;
}

.model-stats {
  display: flex;
  gap: var(--space-6);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-primary);
}

.stat-small {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-small .stat-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-small .stat-value {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

/* === PARAM FORM === */
.param-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.param-info {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  font-size: 12px;
  color: var(--text-tertiary);
  cursor: help;
  margin-left: var(--space-2);
}

.slider-input {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.slider {
  flex: 1;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--accent-blue);
  border-radius: var(--radius-full);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(74, 158, 255, 0.4);
  transition: all var(--duration-fast);
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.6);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--accent-blue);
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(74, 158, 255, 0.4);
}

.slider-value {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: var(--accent-blue);
  min-width: 50px;
  text-align: right;
}

.split-selector {
  display: flex;
  gap: var(--space-2);
}

.split-btn {
  flex: 1;
  padding: var(--space-3);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.split-btn:hover {
  border-color: var(--accent-blue);
  background: rgba(74, 158, 255, 0.05);
}

.split-btn.active {
  background: var(--accent-blue);
  color: white;
  border-color: var(--accent-blue);
}

.advanced-options {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.advanced-options summary {
  cursor: pointer;
  font-weight: var(--font-medium);
  color: var(--text-primary);
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.advanced-options summary::before {
  content: '▶';
  font-size: 12px;
  transition: transform var(--duration-base);
}

.advanced-options[open] summary::before {
  transform: rotate(90deg);
}

.advanced-content {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-primary);
}

.card-footer {
  padding: var(--space-6);
  border-top: 1px solid var(--border-primary);
}

/* === TRAINING PROGRESS === */
.training-progress {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.progress-label {
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.progress-percentage {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--accent-blue);
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

.eta {
  color: var(--accent-cyan);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.metric-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.metric-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.metric-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-family: var(--font-mono);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.metric-change {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.metric-change.positive {
  color: var(--accent-green);
}

.metric-change.negative {
  color: var(--accent-red);
}

.metric-sparkline {
  height: 40px;
  margin-top: auto;
}

.training-chart {
  height: 300px;
  margin-bottom: var(--space-8);
}

.training-chart canvas {
  width: 100%;
  height: 100%;
}

/* === CONSOLE LOGS === */
.console-logs {
  background: #0D1117;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: #161B22;
  border-bottom: 1px solid var(--border-primary);
}

.console-title {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.console-content {
  max-height: 300px;
  overflow-y: auto;
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.log-line {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  line-height: 1.6;
}

.log-time {
  color: var(--text-tertiary);
}

.log-level {
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-semibold);
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.log-level.info {
  background: rgba(74, 158, 255, 0.15);
  color: var(--accent-blue);
}

.log-level.warn {
  background: rgba(255, 201, 71, 0.15);
  color: var(--accent-yellow);
}

.log-level.error {
  background: rgba(255, 87, 87, 0.15);
  color: var(--accent-red);
}

.log-message {
  color: var(--text-primary);
  flex: 1;
}

/* === MODEL COMPARISON TABLE === */
.table-row-highlight {
  background: rgba(74, 158, 255, 0.05);
  border-left: 3px solid var(--accent-blue);
}

.model-name-cell {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.model-icon-sm {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.metric-good {
  color: var(--accent-green);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
}
```

---

## 6. Animation & Interaction Design

### 6.1 Page Load Animations

**Stagger Fade-In for Lists/Cards**

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-stagger > * {
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.fade-in-stagger > *:nth-child(1) { animation-delay: 0.1s; }
.fade-in-stagger > *:nth-child(2) { animation-delay: 0.2s; }
.fade-in-stagger > *:nth-child(3) { animation-delay: 0.3s; }
.fade-in-stagger > *:nth-child(4) { animation-delay: 0.4s; }
.fade-in-stagger > *:nth-child(5) { animation-delay: 0.5s; }
```

**JavaScript Intersection Observer Implementation**

```javascript
// Animate elements when they enter viewport
const observeElements = (selector) => {
  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
  );
  
  elements.forEach(el => {
    el.classList.add('observe-on-scroll');
    observer.observe(el);
  });
};

// Usage
observeElements('.feature-card');
observeElements('.kpi-card');
```

### 6.2 Micro-Interactions

**Button Ripple Effect**

```css
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-ripple:active::after {
  width: 300px;
  height: 300px;
}
```

**Tooltip Animations**

```css
@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip.visible {
  animation: tooltipFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Input Focus Effects**

```css
.input-field {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-field:focus {
  transform: scale(1.02);
}

/* Floating label animation */
.input-group {
  position: relative;
}

.floating-label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
  transition: all 0.2s;
}

.input-field:focus ~ .floating-label,
.input-field:not(:placeholder-shown) ~ .floating-label {
  top: -8px;
  font-size: 12px;
  color: var(--accent-blue);
  background: var(--bg-secondary);
  padding: 0 4px;
}
```

### 6.3 Loading States

**Skeleton Loaders**

```css
@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-elevated) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-md);
}

.skeleton-text {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-text:last-child {
  width: 60%;
}

.skeleton-card {
  height: 200px;
}
```

**Spinner Component**

```html
<div class="spinner">
  <div class="spinner-ring"></div>
</div>
```

```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
}

.spinner-ring {
  width: 100%;
  height: 100%;
  border: 3px solid var(--bg-tertiary);
  border-top-color: var(--accent-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

**Progress Bar with Shimmer**

```css
.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 6.4 Chart Animations

**D3.js Line Chart with Animated Draw**

```javascript
// Animate line path drawing
function animateLinePath(path) {
  const length = path.node().getTotalLength();
  
  path
    .attr('stroke-dasharray', length + ' ' + length)
    .attr('stroke-dashoffset', length)
    .transition()
    .duration(2000)
    .ease(d3.easeCubicInOut)
    .attr('stroke-dashoffset', 0);
}

// Animate bars from bottom
function animateBars(bars) {
  bars
    .attr('y', height)
    .attr('height', 0)
    .transition()
    .duration(800)
    .delay((d, i) => i * 50)
    .ease(d3.easeCubicOut)
    .attr('y', d => yScale(d.value))
    .attr('height', d => height - yScale(d.value));
}
```

### 6.5 Notification System

**Toast Notifications**

```html
<div class="toast-container"></div>
```

```css
.toast-container {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.toast {
  background: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  min-width: 300px;
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  opacity: 0;
  transform: translateX(400px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 2px;
}

.toast-message {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: var(--space-2);
}

.toast-success {
  border-left: 4px solid var(--accent-green);
}

.toast-error {
  border-left: 4px solid var(--accent-red);
}

.toast-warning {
  border-left: 4px solid var(--accent-yellow);
}

.toast-info {
  border-left: 4px solid var(--accent-blue);
}
```

```javascript
function showToast(title, message, type = 'info') {
  const container = document.querySelector('.toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${getIcon(type)}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">✕</button>
  `;
  
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Auto dismiss after 5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
  
  // Close button
  toast.querySelector('.toast-close').onclick = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  };
}

function getIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[type] || icons.info;
}

// Usage
showToast('Success', 'Model trained successfully!', 'success');
showToast('Error', 'Failed to upload dataset', 'error');
```

---

## 7. Responsive Design Strategy

### 7.1 Breakpoints

```css
/* Mobile First Approach */
:root {
  --bp-xs: 0px;      /* Extra small devices */
  --bp-sm: 640px;    /* Small devices (phones) */
  --bp-md: 768px;    /* Medium devices (tablets) */
  --bp-lg: 1024px;   /* Large devices (laptops) */
  --bp-xl: 1280px;   /* Extra large (desktops) */
  --bp-2xl: 1536px;  /* 2X large (large desktops) */
}
```

### 7.2 Dashboard Responsive Layout

```css
/* Desktop (default) */
.dashboard-layout {
  grid-template-columns: 280px 1fr;
}

/* Tablet */
@media (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
    transition: transform 0.3s;
    z-index: 100;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .dashboard-main {
    margin-left: 0;
  }
  
  /* Show hamburger menu */
  .mobile-menu-btn {
    display: flex;
  }
  
  /* Adjust grid layouts */
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .kpi-grid,
  .features-grid,
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .hero {
    grid-template-columns: 1fr;
  }
  
  .auth-container {
    grid-template-columns: 1fr;
  }
  
  .auth-left {
    display: none; /* Hide decorative left panel on mobile */
  }
  
  /* Stack navigation */
  .nav-links {
    flex-direction: column;
  }
  
  /* Full width buttons */
  .hero-cta {
    flex-direction: column;
  }
  
  .hero-cta button {
    width: 100%;
  }
  
  /* Adjust font sizes */
  .hero-title {
    font-size: var(--text-4xl);
  }
  
  .section-title {
    font-size: var(--text-3xl);
  }
  
  /* Hide table columns on mobile */
  .data-table th:nth-child(3),
  .data-table td:nth-child(3),
  .data-table th:nth-child(4),
  .data-table td:nth-child(4),
  .data-table th:nth-child(5),
  .data-table td:nth-child(5) {
    display: none;
  }
}
```

### 7.3 Responsive Data Tables

**Horizontal Scroll Wrapper**

```html
<div class="table-responsive">
  <table class="data-table">
    <!-- ... -->
  </table>
</div>
```

```css
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .data-table {
    font-size: var(--text-sm);
  }
  
  .data-table th,
  .data-table td {
    padding: var(--space-2) var(--space-3);
    white-space: nowrap;
  }
}
```

---

## 8. Accessibility (WCAG 2.1 AA Compliance)

### 8.1 Color Contrast

All text must meet WCAG AA standards:
- Normal text (< 18px): Contrast ratio ≥ 4.5:1
- Large text (≥ 18px): Contrast ratio ≥ 3:1
- UI components: Contrast ratio ≥ 3:1

**Verification:**
```css
/* High contrast mode media query */
@media (prefers-contrast: high) {
  :root {
    --bg-primary: #000000;
    --text-primary: #FFFFFF;
    --border-primary: #FFFFFF;
  }
}
```

### 8.2 Keyboard Navigation

```css
/* Focus visible for keyboard users */
*:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent-blue);
  color: white;
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

**Tab Order Management**

```html
<!-- Proper tab order with tabindex -->
<nav>
  <a href="#main" class="skip-link" tabindex="1">Skip to main content</a>
  <a href="/" tabindex="2">Home</a>
  <a href="/dashboard" tabindex="3">Dashboard</a>
</nav>
```

### 8.3 ARIA Labels

```html
<!-- Button with icon needs aria-label -->
<button class="btn-icon" aria-label="Close modal">
  <svg aria-hidden="true">✕</svg>
</button>

<!-- Loading state -->
<div 
  class="spinner" 
  role="status" 
  aria-live="polite" 
  aria-busy="true"
>
  <span class="sr-only">Loading...</span>
</div>

<!-- Form with error -->
<div class="form-group">
  <label for="email">Email</label>
  <input 
    type="email" 
    id="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" class="error-message" role="alert">
    Please enter a valid email
  </span>
</div>

<!-- Data table -->
<table role="table" aria-label="Model comparison">
  <thead role="rowgroup">
    <tr role="row">
      <th role="columnheader">Model</th>
      <th role="columnheader">Accuracy</th>
    </tr>
  </thead>
  <tbody role="rowgroup">
    <tr role="row">
      <td role="cell">XGBoost</td>
      <td role="cell">97.2%</td>
    </tr>
  </tbody>
</table>
```

### 8.4 Screen Reader Only Content

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 8.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Implementation Guidelines

### 9.1 Tech Stack Recommendations

**Frontend Framework:** React 18+ with TypeScript  
**Build Tool:** Vite 5+  
**State Management:** Zustand or Redux Toolkit  
**Routing:** React Router v6  
**Data Fetching:** TanStack Query (React Query)  
**Charts:** D3.js + Recharts  
**Forms:** React Hook Form + Zod validation  
**UI Components:** Headless UI or Radix UI (unstyled primitives)  
**Styling:** CSS Modules or Tailwind CSS  
**Icons:** Lucide React or Heroicons  
**Animations:** Framer Motion  

### 9.2 Project Structure

```
src/
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── Toast/
│   ├── charts/
│   │   ├── LineChart/
│   │   ├── BarChart/
│   │   └── Sparkline/
│   └── layout/
│       ├── Sidebar/
│       ├── TopNav/
│       └── DashboardLayout/
├── pages/
│   ├── Landing/
│   ├── Auth/
│   ├── Dashboard/
│   ├── DataManagement/
│   ├── ModelTraining/
│   └── Analytics/
├── hooks/
│   ├── useAuth.ts
│   ├── useDataUpload.ts
│   └── useModelTraining.ts
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── models.ts
├── stores/
│   ├── authStore.ts
│   ├── dataStore.ts
│   └── modelStore.ts
├── styles/
│   ├── variables.css
│   ├── global.css
│   └── utilities.css
├── types/
│   └── index.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
└── App.tsx
```

### 9.3 Component Example (Button)

```typescript
// components/common/Button/Button.tsx
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const classes = [
    styles.btn,
    styles[`btn-${variant}`],
    styles[`btn-${size}`],
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      <span className={loading ? styles.hiddenText : undefined}>
        {children}
      </span>
    </button>
  );
};
```

### 9.4 API Integration Pattern

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Example usage
export const uploadDataset = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const percent = (progressEvent.loaded / progressEvent.total) * 100;
      console.log(`Upload Progress: ${percent}%`);
    }
  });
};
```

---

## 10. Performance Optimization

### 10.1 Code Splitting

```typescript
// Lazy load pages
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DataManagement = lazy(() => import('./pages/DataManagement'));
const ModelTraining = lazy(() => import('./pages/ModelTraining'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data" element={<DataManagement />} />
        <Route path="/models" element={<ModelTraining />} />
      </Routes>
    </Suspense>
  );
}
```

### 10.2 Image Optimization

```html
<!-- Use WebP with fallbacks -->
<picture>
  <source srcset="hero.webp" type="image/webp" />
  <source srcset="hero.jpg" type="image/jpeg" />
  <img src="hero.jpg" alt="Hero" loading="lazy" />
</picture>

<!-- Responsive images -->
<img 
  srcset="
    small.jpg 400w,
    medium.jpg 800w,
    large.jpg 1200w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 80vw,
    1200px
  "
  src="medium.jpg"
  alt="..."
/>
```

### 10.3 Chart Rendering Optimization

```javascript
// Debounce resize events
import { debounce } from 'lodash';

const handleResize = debounce(() => {
  chart.resize();
}, 250);

window.addEventListener('resize', handleResize);

// Use Canvas for large datasets (>1000 points)
// Use SVG for smaller datasets with interactions

// Virtualize large tables
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualTable({ data }) {
  const parentRef = useRef();
  
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            {data[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 10.4 Caching Strategy

```typescript
// React Query configuration
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3
    }
  }
});

// Usage
function DatasetList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['datasets'],
    queryFn: fetchDatasets,
    staleTime: 60000 // 1 minute
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;
  
  return <DataTable data={data} />;
}
```

---

## Conclusion

This comprehensive UI/UX redesign documentation provides a complete blueprint for transforming your ForecastAI SaaS platform into a professional, modern, and highly functional data science tool.

**Key Deliverables:**
✅ Complete design system with colors, typography, spacing  
✅ Page-by-page specifications with HTML/CSS  
✅ Interactive components library  
✅ Animation & micro-interaction guidelines  
✅ Responsive design strategy  
✅ Accessibility compliance (WCAG 2.1 AA)  
✅ Implementation guidelines with code examples  
✅ Performance optimization strategies  

**Next Steps:**
1. Review and approve design system
2. Create Figma/Sketch mockups (optional but recommended)
3. Implement component library in React + TypeScript
4. Build pages iteratively (Landing → Auth → Dashboard → Data → Models → Analytics)
5. Test accessibility with screen readers and keyboard navigation
6. Performance audit with Lighthouse
7. User testing with target audience (data scientists)

---

**Document Version:** 2.0  
**Last Updated:** February 2026  
**Maintained by:** ForecastAI Design Team
