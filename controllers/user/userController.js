const i = require("../user/services/personalization");
const ii = require("../user/services/events/events_query/eventsQuery");
const iii = require("../user/services/events/events_creation_or_modification/nameAvailability");
const iv = require("../user/services/events/events_creation_or_modification/createEvent");
const v = require("../user/services/events/pricing_query/pricingQuery");
const vi = require("../user/services/tickets/ticketPurchase");

// personalizationChecker
exports.personalizationChecker = i.personalizationChecker;

// personalization
exports.personalization = i.personalization;

// checks regime name
exports.nameCheck = iii.nameAvailability;

// creates regime
exports.regimeCreate = iv.createRegime;

// queries regimes online
exports.regimesQueryOnline = ii.eventQueryPersonalizedOrNot;

// queries regimes offline
exports.regimesQueryOffline = ii.offline;

// queries pricings online
exports.pricingsOnline = v.pricingQueryOnline;

// queries pricings offline
exports.pricingsOffline = v.pricingQueryOffline;

// queries pricings offline
exports.purchaseInitializer = vi.ticketsPurchase;

// queries pricings offline
exports.purchaseVerifier = vi.purchaseVerifier;
