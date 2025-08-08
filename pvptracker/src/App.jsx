import { useState, useEffect } from 'react'
import './App.css'
import FightDataInput from './components/FightDataInput'
import FightMetricsDisplay from './components/FightMetricsDisplay'
import FightHistory from './components/FightHistory'
import { FightDataParser } from './utils/fightDataParser'

function App() {
  const [fightData, setFightData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fightHistory, setFightHistory] = useState([])
  const [selectedFight, setSelectedFight] = useState(null)

  const parser = new FightDataParser()

  // Load fight history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('pvpFightHistory')
    if (savedHistory) {
      try {
        setFightHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Error loading fight history:', error)
      }
    }
  }, [])

  // Save fight history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pvpFightHistory', JSON.stringify(fightHistory))
  }, [fightHistory])

  const handleFightDataSubmit = async (jsonData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const parsedData = parser.parseFightData(jsonData)
      
      // Add to fight history
      const newFight = {
        id: Date.now(),
        timestamp: Date.now(),
        data: parsedData,
        competitorName: parsedData.competitor.name,
        opponentName: parsedData.opponent.name
      }
      
      setFightHistory(prev => [newFight, ...prev.slice(0, 49)]) // Keep last 50 fights
      setFightData(parsedData)
      setSelectedFight(newFight)
    } catch (err) {
      setError(err.message)
      setFightData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearData = () => {
    setFightData(null)
    setSelectedFight(null)
    setError(null)
  }

  const handleFightSelect = (fight) => {
    setSelectedFight(fight)
    setFightData(fight.data)
  }

  const handleClearHistory = () => {
    setFightHistory([])
    localStorage.removeItem('pvpFightHistory')
  }

  const handleDeleteFight = (fightId) => {
    setFightHistory(prev => prev.filter(fight => fight.id !== fightId))
    
    // If the deleted fight was selected, clear the selection
    if (selectedFight && selectedFight.id === fightId) {
      setSelectedFight(null)
      setFightData(null)
    }
  }

  const getWinner = (fight) => {
    if (fight.competitor.dead && !fight.opponent.dead) {
      return fight.opponent.name
    } else if (!fight.competitor.dead && fight.opponent.dead) {
      return fight.competitor.name
    }
    return null
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>PvP Performance Tracker</h1>
        <p>Paste your fight data to view detailed metrics</p>
      </header>
      
      <main className="app-main">
        <div className="app-content">
          <div className="input-section">
            <FightDataInput 
              onSubmit={handleFightDataSubmit}
              onClear={handleClearData}
              isLoading={isLoading}
              error={error}
            />
          </div>
          
          <div className="display-section">
            {fightData && (
              <FightMetricsDisplay 
                fightData={fightData}
                parser={parser}
                winner={getWinner(fightData)}
              />
            )}
          </div>
        </div>

        <div className="history-section">
          <FightHistory 
            fights={fightHistory}
            selectedFight={selectedFight}
            onFightSelect={handleFightSelect}
            onClearHistory={handleClearHistory}
            onDeleteFight={handleDeleteFight}
            getWinner={getWinner}
          />
        </div>
      </main>
    </div>
  )
}

export default App
