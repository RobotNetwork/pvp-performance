import { useState, useEffect, useRef } from 'react'
import './FightDataInput.css'

const FightDataInput = ({ onSubmit, onClear, isLoading, error }) => {
  const [inputValue, setInputValue] = useState(() => {
    const saved = localStorage.getItem('pvpFightDataInput')
    return saved || ''
  })
  const [showPasted, setShowPasted] = useState(false)
  const hasAutoAnalyzed = useRef(false)

  // Save input value to localStorage whenever it changes
  useEffect(() => {
    if (inputValue) {
      localStorage.setItem('pvpFightDataInput', inputValue)
    } else {
      localStorage.removeItem('pvpFightDataInput')
    }
  }, [inputValue])

  // Auto-analyze when input changes (only once per paste)
  useEffect(() => {
    if (inputValue.trim() && !isLoading && !hasAutoAnalyzed.current) {
      // Show "Pasted!" message
      setShowPasted(true)
      
      // Mark as analyzed to prevent recursion
      hasAutoAnalyzed.current = true
      
      // Auto-analyze after a brief delay
      const timer = setTimeout(() => {
        onSubmit(inputValue.trim())
        setShowPasted(false)
        // Clear input field after successful submission
        setInputValue('')
        hasAutoAnalyzed.current = false
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [inputValue, onSubmit, isLoading])

  // Reset the flag when input is cleared
  useEffect(() => {
    if (!inputValue.trim()) {
      hasAutoAnalyzed.current = false
    }
  }, [inputValue])

  // Auto-hide "Pasted!" message after 2.5 seconds
  useEffect(() => {
    if (showPasted) {
      const timer = setTimeout(() => {
        setShowPasted(false)
      }, 2500)
      
      return () => clearTimeout(timer)
    }
  }, [showPasted])

  const handlePaste = (e) => {
    // Clear any previous error when new data is pasted
    if (onClear) {
      onClear()
    }
    // Reset the auto-analyze flag for new pastes
    hasAutoAnalyzed.current = false
  }

  return (
    <div className="fight-data-input">
      <div className="input-header">
        <h2>Paste Fight Data</h2>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {showPasted && (
        <div className="pasted-message">
          <span className="pasted-icon">✓</span>
          <span>Pasted!</span>
        </div>
      )}

      <div className="textarea-container">
        <textarea
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          onPaste={handlePaste}
          placeholder=""
          className={`fight-data-textarea ${showPasted ? 'pasted' : ''}`}
          disabled={isLoading}
        />
        <div className="textarea-overlay">
          <div className="paste-instructions">
            <span className="paste-icon">📋</span>
            <span>Paste fight data here</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FightDataInput
