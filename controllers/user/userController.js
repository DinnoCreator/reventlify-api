const i = require("../user/services/personalization");
const ii = require("../user/services/events/events_query/gEventsQuery");
const iiSub = require("../user/services/events/events_query/pEventsQuery");
const iiSubi = require("../user/services/events/events_query/sEventQuery");
const iii = require("../user/services/events/events_creation_or_modification/nameAvailability");
const iv = require("../user/services/events/events_creation_or_modification/createEvent");
const v = require("../user/services/events/pricing_query/pricingQuery");
const vi = require("../user/services/tickets/ticketPurchase");
const vii = require("../user/services/tickets/ticketsQuery");
const viiSub = require("../user/services/tickets/ticketShare");
const viii = require("./services/events/regime_handle_services/ticketBoughtUpdate");
const ix = require("../user/services/events/events_query/oEventQuery");
const x = require("./services/events/regime_handle_services/ticketBoughtTAY_comparison");
const xi = require("./services/events/regime_handle_services/regimesCreatedOrPartOf");

/* clients routes begining*/
// personalizationChecker
exports.whoIs = i.userChecker;

// personalizationChecker
exports.personalizationChecker = i.personalizationChecker;

// personalization
exports.personalization = i.personalization;

// queries regimes online
exports.regimesQueryOnline = ii.eventQueryPersonalizedOrNot;

// queries regimes offline
exports.regimesQueryOffline = ii.offline;

// queries event offline
exports.whichEvent = ix.oneEvent;

// queries regimes most popular event in a cathegory
exports.mostPopularInCat = iiSub.popularEventInACathegory;

// queries regimes most popular event
exports.mostPopularEvent = iiSub.mostPopularEvent;

// Search Events
exports.searchEvents = iiSubi.searchEvents;

// queries pricings online
exports.pricingsOnline = v.pricingQueryOnline;

// queries pricings offline
exports.pricingsOffline = v.pricingQueryOffline;

// ticket purchase
exports.purchaseInitializer = vi.ticketsPurchase;

// ticket purchase verifier
exports.purchaseWebHook = vi.paystackWebhook;

// ticket purchase verifier2
exports.purchaseVerifier = vi.purchaseVerifier;

// tickets query
exports.ticketsOwned = vii.ticketsQuery;

// ticket query
exports.ticketOwned = vii.ticketQuery;

// ticket query
exports.ticketShare = viiSub.ticketShare;
/* clients routes ending*/

/* regime routes begining*/
// checks regime name
exports.nameCheck = iii.nameAvailability;

// creates regime
exports.regimeCreate = iv.createRegime;

// regimes created or part of
exports.regimeCreatedOrPart = xi.regimeRoles;

// regime dashboard
exports.regimeDashboardStatic = xi.regimeDashWithRole;

// ticket sales analysis for today and yesterday
exports.salesForTAY = x.ticketBoughtTAY_comparison;

// last ten tickets bought
exports.lastTen = viii.lastTenTicketBoughtUpdate;
/* regime creators routes ending*/
