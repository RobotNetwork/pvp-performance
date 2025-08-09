import './FightMetricsDisplay.css'

const FightMetricsDisplay = ({ fightData, parser, winner }) => {
	const competitorMetrics = parser.formatMetrics(fightData.competitor, true, fightData.opponent)
	const opponentMetrics = parser.formatMetrics(fightData.opponent, false, fightData.competitor)

	// Calculate differences for visual indicators - only show on the better side
	const getAttackDifference = () => {
		const compAttacks = fightData.competitor.attackCount
		const oppAttacks = fightData.opponent.attackCount
		let diff = 0
		if (compAttacks > oppAttacks) {
			diff = compAttacks - oppAttacks
		} else {
			diff = oppAttacks - compAttacks
		}
		return diff !== 0 ? (diff > 0 ? `+${diff}` : `${diff}`) : null
	}

	const getDamageDifference = () => {
		const compDamage = fightData.competitor.damageDealt
		const oppDamage = fightData.opponent.damageDealt
		let diff = 0
		if (compDamage > oppDamage) {
			diff = compDamage - oppDamage
		} else {
			diff = oppDamage - compDamage
		}
		return diff !== 0 ? (diff > 0 ? `+${diff}` : `${diff}`) : null
	}

	const getDeservedDamageDifference = () => {
		const compDeserved = fightData.competitor.deservedDamage
		const oppDeserved = fightData.opponent.deservedDamage
		let diff = 0
		if (compDeserved > oppDeserved) {
			diff = compDeserved - oppDeserved
		} else {
			diff = oppDeserved - compDeserved
		}
		return diff !== 0 ? (diff > 0 ? `+${parser.numberFormat.format(diff)}` : `${parser.numberFormat.format(diff)}`) : null
	}

	const getKoChancesDifference = () => {
		const compKoChances = competitorMetrics.koChances.count
		const oppKoChances = opponentMetrics.koChances.count
		let diff = 0
		if (compKoChances > oppKoChances) {
			diff = compKoChances - oppKoChances
		} else {
			diff = oppKoChances - compKoChances
		}
		return diff !== 0 ? (diff > 0 ? `+${diff}` : `${diff}`) : null
	}

	const parsePercentage = (percentage) => {
		// Extract the percentage number from strings like "28/55 (50.9%)" or "3/28 (10.7%)"
		const match = percentage.match(/\(([\d.]+)%\)/)
		return match ? parseFloat(match[1]) : 0
	}

	return (
		<div className="fight-metrics-display">
			<div className="fight-header">
				<h2>Fight Analysis</h2>
				<div className="fight-info">
					<div className="fight-world">
						<strong>World:</strong> {fightData.world}
					</div>
				</div>
			</div>

			<div className="metrics-container">
				<div className={`fighter-metrics competitor ${winner === competitorMetrics.name ? 'winner' : 'loser'}`}>
					<h3>{winner === competitorMetrics.name && (<span>👑 </span>)}{competitorMetrics.name}</h3>
					<div className="metrics-grid">
						<div className="metric-row">
							<span className="metric-label">Off-prayer hits:</span>
							<span className="metric-value">
								{competitorMetrics.offPrayStats}
								{getAttackDifference() && fightData.competitor.attackCount > fightData.opponent.attackCount && (
									<span className="difference positive">{getAttackDifference()}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Deserved damage:</span>
							<span className="metric-value">
								{competitorMetrics.deservedDamage}
								{getDeservedDamageDifference() && fightData.competitor.deservedDamage > fightData.opponent.deservedDamage && (
									<span className="difference positive">{getDeservedDamageDifference()}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Damage dealt:</span>
							<span className="metric-value">
								{competitorMetrics.damageDealt}
								{getDamageDifference() && fightData.competitor.damageDealt > fightData.opponent.damageDealt && (
									<span className="difference positive">{getDamageDifference()}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Magic hits:</span>
							<span className="metric-value">
								{competitorMetrics.magicStats.split(" ")[0]} {/* example: "28/55 (50.9%)" -> "28/55" */}
								{parsePercentage(competitorMetrics.magicStats) > parsePercentage(opponentMetrics.magicStats) && (
									<span className="difference positive">{competitorMetrics.magicStats.split(" ")[1]}</span>
								)}
								{parsePercentage(competitorMetrics.magicStats) < parsePercentage(opponentMetrics.magicStats) && (
									<span className="difference negative">{competitorMetrics.magicStats.split(" ")[1]}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Offensive prayers:</span>
							<span className="metric-value">{competitorMetrics.offensivePrayStats}</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">HP healed:</span>
							<span className="metric-value">{competitorMetrics.hpHealed}</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Robe hits:</span>
							<span className="metric-value">
								{competitorMetrics.robeHitStats.split(" ")[0]}
								{parsePercentage(competitorMetrics.robeHitStats) < parsePercentage(opponentMetrics.robeHitStats) && (
									<span className="difference positive">{competitorMetrics.robeHitStats.split(" ")[1]}</span>
								)}
								{parsePercentage(competitorMetrics.robeHitStats) > parsePercentage(opponentMetrics.robeHitStats) && (
									<span className="difference negative">{competitorMetrics.robeHitStats.split(" ")[1]}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Ghost barrages:</span>
							<span className="metric-value">{competitorMetrics.ghostBarrageStats}</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">KO Chances:</span>
							<span className="metric-value">
								{competitorMetrics.koChances.count} ({competitorMetrics.koChances.overallProbability > 0 ? (competitorMetrics.koChances.overallProbability * 100).toFixed(1) : '0.0'}%)
								{getKoChancesDifference() && competitorMetrics.koChances.count > opponentMetrics.koChances.count && (
									<span className="difference positive">{getKoChancesDifference()}</span>
								)}
							</span>
						</div>
					</div>
				</div>

				<div className={`fighter-metrics opponent ${winner === opponentMetrics.name ? 'winner' : 'loser'}`}>
					<h3>{winner === opponentMetrics.name && (<span>👑 </span>)}{opponentMetrics.name}</h3>
					<div className="metrics-grid">
						<div className="metric-row">
							<span className="metric-label">Off-prayer hits:</span>
							<span className="metric-value">
								{opponentMetrics.offPrayStats}
								{getAttackDifference() && fightData.opponent.attackCount > fightData.competitor.attackCount && (
									<span className="difference positive">{getAttackDifference()}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Deserved damage:</span>
							<span className="metric-value">
								{opponentMetrics.deservedDamage}
								{getDeservedDamageDifference() && fightData.opponent.deservedDamage > fightData.competitor.deservedDamage && (
									<span className="difference positive">{getDeservedDamageDifference()}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Damage dealt:</span>
							<span className="metric-value">
								{opponentMetrics.damageDealt}
								{getDamageDifference() && fightData.opponent.damageDealt > fightData.competitor.damageDealt && (
									<span className="difference positive">{getDamageDifference()}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Magic hits:</span>
							<span className="metric-value">
								{opponentMetrics.magicStats.split(" ")[0]} {/* example: "11/21 (103.9%)" -> "11/21" */}
								{parsePercentage(opponentMetrics.magicStats) > parsePercentage(competitorMetrics.magicStats) && (
									<span className="difference positive">{opponentMetrics.magicStats.split(" ")[1]}</span>
								)}
								{parsePercentage(opponentMetrics.magicStats) < parsePercentage(competitorMetrics.magicStats) && (
									<span className="difference negative">{opponentMetrics.magicStats.split(" ")[1]}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Offensive prayers:</span>
							<span className="metric-value">{opponentMetrics.offensivePrayStats}</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">HP healed:</span>
							<span className="metric-value">{opponentMetrics.hpHealed}</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Robe hits:</span>
							<span className="metric-value">
								{opponentMetrics.robeHitStats.split(" ")[0]}
								{parsePercentage(opponentMetrics.robeHitStats) < parsePercentage(competitorMetrics.robeHitStats) && (
									<span className="difference positive">{opponentMetrics.robeHitStats.split(" ")[1]}</span>
								)}
								{parsePercentage(opponentMetrics.robeHitStats) > parsePercentage(competitorMetrics.robeHitStats) && (
									<span className="difference negative">{opponentMetrics.robeHitStats.split(" ")[1]}</span>
								)}
							</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">Ghost barrages:</span>
							<span className="metric-value">{opponentMetrics.ghostBarrageStats}</span>
						</div>
						<div className="metric-row">
							<span className="metric-label">KO Chances:</span>
							<span className="metric-value">
								{opponentMetrics.koChances.count} ({opponentMetrics.koChances.overallProbability > 0 ? (opponentMetrics.koChances.overallProbability * 100).toFixed(1) : '0.0'}%)
								{getKoChancesDifference() && opponentMetrics.koChances.count > competitorMetrics.koChances.count && (
									<span className="difference positive">{getKoChancesDifference()}</span>
								)}

							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default FightMetricsDisplay
