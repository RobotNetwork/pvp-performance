import './FightHistory.css'

const FightHistory = ({ fights, selectedFight, onFightSelect, onClearHistory, onDeleteFight, getWinner }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (fights.length === 0) {
    return (
      <div className="fight-history">
        <div className="history-header">
          <h3>Fight History</h3>
        </div>
        <div className="empty-history">
          <p>No fights saved yet. Paste your first fight data to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fight-history">
      <div className="history-header">
        <h3>Fight History ({fights.length})</h3>
        <button 
          onClick={onClearHistory}
          className="btn btn-danger btn-small"
          title="Clear all fight history"
        >
          Clear All
        </button>
      </div>
      
      <div className="history-list">
        {fights.map((fight) => {
          const winner = getWinner(fight.data)
          const isSelected = selectedFight && selectedFight.id === fight.id
          
          return (
            <div 
              key={fight.id}
              className={`history-item ${isSelected ? 'selected' : ''}`}
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
                <span className="competitor-name">{fight.competitorName}</span>
                <span className="vs">vs</span>
                <span className="opponent-name">{fight.opponentName}</span>
              </div>
              
              <div className="fight-meta">
                <span className="fight-time">{formatTime(fight.timestamp)}</span>
                {winner && (
                  <span className="winner-indicator">
                    🏆 {winner}
                  </span>
                )}
              </div>
              
              <div className="fight-stats">
                <span className="damage-dealt">
                  {fight.data.competitor.damageDealt} - {fight.data.opponent.damageDealt}
                </span>
                <span className="attack-count">
                  {fight.data.competitor.attackCount} - {fight.data.opponent.attackCount}
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
