// PvP Performance Tracker - Fight Data Parser
// Based on the Java plugin's serialization patterns

export class FightDataParser {
  constructor() {
    this.numberFormat = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
  }

  // Parse the main fight data structure
  parseFightData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (!data.c || !data.o) {
        throw new Error('Invalid fight data: missing competitor or opponent data');
      }

      const competitor = this.parseFighter(data.c);
      const opponent = this.parseFighter(data.o);
      
      return {
        competitor,
        opponent,
        lastFightTime: data.t || 0,
        fightType: data.l || 'UNKNOWN',
        world: data.w || 0
      };
    } catch (error) {
      console.error('Error parsing fight data:', error);
      throw new Error('Failed to parse fight data: ' + error.message);
    }
  }

  // Parse fighter data based on the Java @SerializedName patterns
  parseFighter(fighterData) {
    return {
      name: fighterData.n || 'Unknown',
      attackCount: fighterData.a || 0,
      offPraySuccessCount: fighterData.s || 0,
      deservedDamage: fighterData.d || 0,
      damageDealt: fighterData.h || 0,
      totalMagicAttackCount: fighterData.z || 0,
      magicHitCount: fighterData.m || 0,
      magicHitCountDeserved: fighterData.M || 0,
      offensivePraySuccessCount: fighterData.p || 0,
      ghostBarrageCount: fighterData.g || 0,
      ghostBarrageDeservedDamage: fighterData.y || 0,
      hpHealed: fighterData.H || 0,
      robeHits: fighterData.rh || 0,
      dead: fighterData.x || false,
      fightLogEntries: this.parseFightLogEntries(fighterData.l || [])
    };
  }

  // Parse fight log entries
  parseFightLogEntries(entries) {
    return entries.map(entry => this.parseFightLogEntry(entry));
  }

  // Parse individual fight log entry
  parseFightLogEntry(entry) {
    return {
      time: entry.t || 0,
      tick: entry.T || 0,
      isFullEntry: entry.f || false,
      attackerGear: entry.G || [],
      attackerOverhead: entry.O || null,
      animationData: entry.m || null,
      deservedDamage: entry.d || 0,
      accuracy: entry.a || 0,
      maxHit: entry.h || 0,
      minHit: entry.l || 0,
      splash: entry.s || false,
      attackerLevels: this.parseCombatLevels(entry.C),
      koChance: entry.k || null,
      estimatedHpBeforeHit: entry.eH || null,
      opponentMaxHp: entry.oH || null,
      matchedHitsCount: entry.mC || 0,
      actualDamageSum: entry.aD || 0,
      defenderGear: entry.g || [],
      defenderOverhead: entry.o || null,
      attackerOffensivePray: entry.p || 0,
      expectedHits: entry.expectedHits || 1,
      isGmaulSpecial: entry.GMS || false,
      displayHpBefore: entry.displayHpBefore || null,
      displayHpAfter: entry.displayHpAfter || null,
      displayKoChance: entry.displayKoChance || null,
      isPartOfTickGroup: entry.isPartOfTickGroup || false
    };
  }

  // Parse combat levels
  parseCombatLevels(levelsData) {
    if (!levelsData) return null;
    
    return {
      atk: levelsData.a || 0,
      str: levelsData.s || 0,
      def: levelsData.d || 0,
      range: levelsData.r || 0,
      mage: levelsData.m || 0,
      hp: levelsData.h || 0
    };
  }

  // Calculate metrics for display
  calculateMetrics(fighter) {
    const offPrayPercentage = fighter.attackCount > 0 
      ? (fighter.offPraySuccessCount / fighter.attackCount * 100).toFixed(1)
      : '0.0';

    // For magic stats, calculate luck percentage as (actual_hits / deserved_hits) * 100
    const magicHitPercentage = fighter.magicHitCountDeserved > 0
      ? ((fighter.magicHitCount / fighter.magicHitCountDeserved) * 100).toFixed(1)
      : '0.0';

    const offensivePrayPercentage = fighter.attackCount > 0
      ? (fighter.offensivePraySuccessCount / fighter.attackCount * 100).toFixed(1)
      : '0.0';

    // For robe hits, calculate as hits / (opponent's melee+range attacks)
    // This will be calculated in formatMetrics when we have both fighters' data
    const robeHitPercentage = fighter.attackCount > 0
      ? (fighter.robeHits / fighter.attackCount * 100).toFixed(1)
      : '0.0';

    // Calculate KO chances metrics
    const koChances = this.calculateKoChances(fighter.fightLogEntries);

    return {
      offPrayStats: `${fighter.offPraySuccessCount}/${fighter.attackCount} (${offPrayPercentage}%)`,
      deservedDamage: this.numberFormat.format(fighter.deservedDamage),
      damageDealt: fighter.damageDealt,
      magicStats: `${fighter.magicHitCount}/${fighter.totalMagicAttackCount} (${magicHitPercentage}%)`,
      offensivePrayStats: `${fighter.offensivePraySuccessCount}/${fighter.attackCount} (${offensivePrayPercentage}%)`,
      hpHealed: fighter.hpHealed,
      robeHitStats: `${fighter.robeHits}/${fighter.attackCount} (${robeHitPercentage}%)`,
      ghostBarrageStats: `${fighter.ghostBarrageCount} G.B. (${this.numberFormat.format(fighter.ghostBarrageDeservedDamage)})`,
      koChances: koChances
    };
  }

  // Calculate KO chances based on fight log entries
  calculateKoChances(fightLogEntries) {
    if (!fightLogEntries || fightLogEntries.length === 0) {
      return { count: 0, overallProbability: 0 };
    }

    let koChanceCount = 0;
    let survivalProbability = 1.0;

    for (const entry of fightLogEntries) {
      if (entry.koChance !== null && entry.koChance > 0) {
        koChanceCount++;
        survivalProbability *= (1.0 - entry.koChance);
      }
    }

    const overallKoProbability = koChanceCount > 0 ? (1.0 - survivalProbability) : 0;

    return {
      count: koChanceCount,
      overallProbability: overallKoProbability
    };
  }

  // Format the metrics for display (matching the plugin output)
  formatMetrics(fighter, isCompetitor = true, opponent = null) {
    const metrics = this.calculateMetrics(fighter);
    
    // Calculate robe hits correctly if we have opponent data
    let robeHitStats = metrics.robeHitStats;
    if (opponent) {
      // For robe hits, we need to use the opponent's melee+range attacks as denominator
      // because robe hits are hits on the opponent when they're wearing robes
      const opponentMeleeRangeAttacks = opponent.attackCount - opponent.totalMagicAttackCount;
      
      const robeHitPercentage = opponentMeleeRangeAttacks > 0
        ? (fighter.robeHits / opponentMeleeRangeAttacks * 100).toFixed(1)
        : '0.0';
      
      robeHitStats = `${fighter.robeHits}/${opponentMeleeRangeAttacks} (${robeHitPercentage}%)`;
    }
    
    return {
      name: fighter.name,
      offPrayStats: metrics.offPrayStats,
      deservedDamage: metrics.deservedDamage,
      damageDealt: metrics.damageDealt,
      magicStats: metrics.magicStats,
      offensivePrayStats: isCompetitor ? metrics.offensivePrayStats : 'N/A',
      hpHealed: isCompetitor ? metrics.hpHealed : 'N/A',
      robeHitStats: robeHitStats,
      ghostBarrageStats: isCompetitor ? metrics.ghostBarrageStats : 'N/A',
      koChances: metrics.koChances
    };
  }
}
