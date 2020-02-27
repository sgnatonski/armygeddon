var cote = require('cote');
var aql = require("arangojs").aql;
var storage = require('@internal/common/storage/arango/arango_storage');

var responder = new cote.Responder({
    name: 'ruleset responder',
    namespace: 'ruleset',
    respondsTo: ['get']
});

responder.on('*', console.log);

responder.on('calculateRealm', async req => {
    await storage.query(aql`LET a = FIRST((
        FOR r IN rulesets
        FILTER r._key != "realm"
        COLLECT AGGREGATE 
        avgPlane = AVERAGE(r.index.plane), 
        avgRoundness = AVERAGE(r.index.roundness),
        avgStance = AVERAGE(r.index.stance),
        avgScore = AVERAGE(r.index.score),
        avgHierarchy = AVERAGE(r.preference.hierarchy),
        avgMobility = AVERAGE(r.preference.mobility),
        avgDefense = AVERAGE(r.preference.defense),
        avgRange = AVERAGE(r.preference.range)
        RETURN { avgPlane: avgPlane, avgRoundness: avgRoundness, avgStance: avgStance, avgScore: avgScore, avgHierarchy: avgHierarchy, avgMobility: avgMobility, avgDefense: avgDefense, avgRange: avgRange }
    ))
    UPSERT { _key: "realm" } 
    INSERT {
        _key: "realm",
        index: {
            plane: a.avgPlane,
            roundness: a.avgRoundness,
            stance: a.avgStance,
            score: a.avgScore
        },
        preference: {
            hierarchy: a.avgHierarchy,
            mobility: a.avgMobility,
            defense: a.avgDefense,
            range: a.avgRange
        }
    }
    UPDATE { 
        index: {
            plane: a.avgPlane,
            roundness: a.avgRoundness,
            stance: a.avgStance,
            score: a.avgScore
        },
        preference: {
            hierarchy: a.avgHierarchy,
            mobility: a.avgMobility,
            defense: a.avgDefense,
            range: a.avgRange
        } 
    }
    IN rulesets
    RETURN NEW
    `);
    return null;
});

function calculatePlaneIndex(userid) {
    return 8;
}

function calculateRoundnessIndex(userid) {
    return 8;
}

function calculateStanceIndex(userid) {
    return 4;
}

function calculateScoreIndex(userid) {
    return 4;
}

responder.on('calculatePlayer', async req => {
    try {
        var current = await storage.rulesets.get(req.userId);
        var currentPref = {
            hierarchy: 4,
            mobility: 4,
            defense: 4,
            range: 4
        };
        if (current){
            currentPref = current.preference;
        }

        var ruleset = {
            id: req.userId,
            index: {
                plane: calculatePlaneIndex(req.userId),
                roundness: calculateRoundnessIndex(req.userId),
                stance: calculateStanceIndex(req.userId),
                score: calculateScoreIndex(req.userId)
            },
            preference: currentPref
        };

        await storage.rulesets.store(ruleset);
    }
    catch (error) {
        log.error(error.message);
        throw Error(error.message);
    }
});