import './FightHistory.css'

const FightHistory = ({ fights, selectedFight, onFightSelect, onClearHistory, onDeleteFight, getWinner, duplicateFightId }) => {
  if (fights.length === 0) {
    return (
      <div className="fight-history">
        <div className="history-header">
          <h3>Fight History</h3>
        </div>
        <div className="no-history">
          <p>No fight data saved.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fight-history">
      <div className="history-header">
        <h3>History ({fights.length})</h3>
        <div
          onClick={onClearHistory}
          className="clear-history-btn"
          title="Delete fight history"
        >
          🗑️
        </div>
      </div>

      <div className="history-list">
        {fights.map((fight) => {
          const winner = getWinner(fight.data)
          const isSelected = selectedFight && selectedFight.id === fight.id
          const isDuplicate = duplicateFightId === fight.id

          return (
            <div
              key={fight.id}
              className={`history-item ${isSelected ? 'selected' : ''} ${isDuplicate ? 'duplicate' : ''}`}
              onClick={() => onFightSelect(fight)}
            >
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteFight(fight.id)
                }}
                title="Delete this fight"
              >
                🗑️
              </button>

              <div className="fight-names">
                <span className="competitor-name">
                  {winner === fight.competitorName
                    ? (<span className="winner-indicator">{fight.competitorName}</span>)
                    : (fight.competitorName)
                  }
                </span>

                <span className="vs">vs</span>

                <span className="opponent-name">
                  {winner === fight.opponentName
                    ? (<span className="winner-indicator">{fight.opponentName}</span>)
                    : (fight.opponentName)
                  }
                </span>
              </div>
              <div className="fight-stats">
                <span className="damage-dealt">
                  <strong>dmg</strong>: {fight.data.competitor.damageDealt} <strong>vs</strong> {fight.data.opponent.damageDealt}
                </span>
                <span className="attack-count">
                  <strong>hits</strong>: {fight.data.competitor.attackCount} <strong>vs</strong> {fight.data.opponent.attackCount}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FightHistory
