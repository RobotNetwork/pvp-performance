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
	const [fightHistory, setFightHistory] = useState(() => {
		const saved = localStorage.getItem('pvpFightHistory')
		if (saved) {
			const parsed = JSON.parse(saved)
			// Add hash to existing fights that don't have it (for backward compatibility)
			return parsed.map(fight => {
				if (!fight.hash && fight.data) {
					// Recreate hash for existing fights using the same algorithm
					const jsonData = JSON.stringify(fight.data)
					let hash = 5381
					for (let i = 0; i < jsonData.length; i++) {
						hash = ((hash << 5) + hash) + jsonData.charCodeAt(i)
					}
					return { ...fight, hash: Math.abs(hash).toString(36) }
				}
				return fight
			})
		}
		return []
	})
	const [selectedFight, setSelectedFight] = useState(null)
	const [duplicateFightId, setDuplicateFightId] = useState(null)

	const parser = new FightDataParser()

	// Hash function to create a unique identifier for fight data
	const hashFightData = (jsonData) => {
		// More robust hash function using djb2 algorithm
		let hash = 5381
		const str = JSON.stringify(jsonData)
		for (let i = 0; i < str.length; i++) {
			hash = ((hash << 5) + hash) + str.charCodeAt(i) // hash * 33 + c
		}
		return Math.abs(hash).toString(36) // Convert to base36 for shorter strings
	}

	// Check if fight already exists in history and return the matching fight
	const findDuplicateFight = (jsonData) => {
		const newHash = hashFightData(jsonData)
		return fightHistory.find(fight => fight.hash === newHash)
	}

	// Auto-clear error and duplicate highlighting after 3 seconds
	useEffect(() => {
		if (error || duplicateFightId) {
			const timer = setTimeout(() => {
				setError(null)
				setDuplicateFightId(null)
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [error, duplicateFightId])

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
				opponentName: parsedData.opponent.name,
				hash: hashFightData(jsonData) // Add hash to the fight object
			}

			const duplicateFight = findDuplicateFight(jsonData)
			if (duplicateFight) {
				setError(`This fight is already within your fight history.`)
				setFightData(null)
				// Highlight the duplicate fight in the history
				setSelectedFight(duplicateFight)
				setDuplicateFightId(duplicateFight.id)
			} else {
				setFightHistory(prev => [newFight, ...prev.slice(0, 49)]) // Keep last 50 fights
				setFightData(parsedData)
				setSelectedFight(newFight)
			}
		} catch (err) {
			setError(err.message)
			setFightData(null)
		} finally {
			setIsLoading(false)
		}
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
						duplicateFightId={duplicateFightId}
					/>
				</div>
			</main>
		</div>
	)
}

export default App
