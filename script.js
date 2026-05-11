// Shared State Keys
const STATE_KEYS = {
    DRAFT_STATE: 'draftState'
};

// Default State Structure
const DEFAULT_STATE = {
    teamNames: {
        left: "TEAM LEFT",
        right: "TEAM RIGHT"
    },
    phase: "BAN PHASE",
    timer: 30,
    timerDuration: 30,
    timerActive: false,
    bans: {
        left: [null, null, null, null, null],
        right: [null, null, null, null, null]
    },
    picks: {
        left: [
            { hero: null, player: "PLAYER 1", role: "ROAMING" },
            { hero: null, player: "PLAYER 2", role: "EXP LANE" },
            { hero: null, player: "PLAYER 3", role: "GOLD LANE" },
            { hero: null, player: "PLAYER 4", role: "MID LANE" },
            { hero: null, player: "PLAYER 5", role: "JUNGLER" }
        ],
        right: [
            { hero: null, player: "PLAYER 6", role: "ROAMING" },
            { hero: null, player: "PLAYER 7", role: "EXP LANE" },
            { hero: null, player: "PLAYER 8", role: "GOLD LANE" },
            { hero: null, player: "PLAYER 9", role: "MID LANE" },
            { hero: null, player: "PLAYER 10", role: "JUNGLER" }
        ]
    },
    activeSlots: {
        bans: {
            left: [false, false, false, false, false],
            right: [false, false, false, false, false]
        },
        picks: {
            left: [false, false, false, false, false],
            right: [false, false, false, false, false]
        }
    },
    selectedSlot: { side: 'left', type: 'picks', index: 0 }
};

// Utilities
function getDraftState() {
    const data = localStorage.getItem(STATE_KEYS.DRAFT_STATE);
    const baseState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    
    if (!data) return baseState;
    
    try {
        const stored = JSON.parse(data);
        // Deep merge to ensure all properties exist
        return {
            ...baseState,
            ...stored,
            teamNames: { ...baseState.teamNames, ...(stored.teamNames || {}) },
            activeSlots: stored.activeSlots || baseState.activeSlots,
            bans: stored.bans || baseState.bans,
            picks: stored.picks || baseState.picks,
            selectedSlot: stored.selectedSlot || baseState.selectedSlot
        };
    } catch (e) {
        console.error("Failed to parse draft state", e);
        return baseState;
    }
}

function saveDraftState(state) {
    localStorage.setItem(STATE_KEYS.DRAFT_STATE, JSON.stringify(state));
}

function resetDraftState() {
    saveDraftState(JSON.parse(JSON.stringify(DEFAULT_STATE)));
}

// Toggle active status for a slot (supports multiple simultaneous active slots)
function toggleActiveSlot(type, side, index) {
    let state = getDraftState();
    
    if (!state.activeSlots) {
        state.activeSlots = JSON.parse(JSON.stringify(DEFAULT_STATE.activeSlots));
    }
    
    // Toggle ONLY the target slot
    state.activeSlots[type][side][index] = !state.activeSlots[type][side][index];
    
    saveDraftState(state);
    return state;
}

// Helper to check if a hero is already picked or banned
function isHeroTaken(heroId, state) {
    const allUsed = [
        ...state.bans.left,
        ...state.bans.right,
        ...state.picks.left.map(p => p.hero),
        ...state.picks.right.map(p => p.hero)
    ];
    return allUsed.some(hero => hero && hero.id === heroId);
}
