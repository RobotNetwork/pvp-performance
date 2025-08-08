import { useState } from 'react'
import './FightDataInput.css'

const FightDataInput = ({ onSubmit, onClear, isLoading, error }) => {
  const [inputValue, setInputValue] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSubmit(inputValue.trim())
    }
  }

  const handleClear = () => {
    setInputValue('')
    onClear()
  }

  return (
    <div className="fight-data-input">
      <div className="input-header">
        <h2>Fight Data Input</h2>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="textarea-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste your fight data JSON here..."
            className={`fight-data-textarea`}
            disabled={isLoading}
            rows={isExpanded ? 8 : 2}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? 'Processing...' : 'Analyze Fight Data'}
          </button>
          <button 
            type="button" 
            onClick={handleClear}
            className="btn btn-danger"
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default FightDataInput
