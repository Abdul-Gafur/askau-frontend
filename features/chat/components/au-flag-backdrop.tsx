/**
 * AUFlagBackdrop — decorative background of African Union member-state flags.
 *
 * Renders every AU member state's flag as a dense, evenly-spaced grid that sits
 * behind the chat interface. It is heavily de-emphasised (blurred, desaturated,
 * low opacity) and a radial mask fades it out through the centre column so it
 * never competes with the conversation, composer, or welcome copy.
 *
 * Purely decorative: aria-hidden and pointer-events-none.
 */

// ISO 3166-1 alpha-2 codes for all 55 African Union member states
// (includes Morocco `ma` and the Sahrawi Arab Democratic Republic `eh`).
const AU_MEMBER_CODES = [
  "dz",
  "ao",
  "bj",
  "bw",
  "bf",
  "bi",
  "cv",
  "cm",
  "cf",
  "td",
  "km",
  "cg",
  "cd",
  "ci",
  "dj",
  "eg",
  "gq",
  "er",
  "sz",
  "et",
  "ga",
  "gm",
  "gh",
  "gn",
  "gw",
  "ke",
  "ls",
  "lr",
  "ly",
  "mg",
  "mw",
  "ml",
  "mr",
  "mu",
  "ma",
  "mz",
  "na",
  "ne",
  "ng",
  "rw",
  "st",
  "sn",
  "sc",
  "sl",
  "so",
  "za",
  "ss",
  "sd",
  "tz",
  "tg",
  "tn",
  "ug",
  "eh",
  "zm",
  "zw",
] as const;

// Repeat the set so the grid always covers large viewports.
const TILES = [...AU_MEMBER_CODES, ...AU_MEMBER_CODES, ...AU_MEMBER_CODES];

export function AUFlagBackdrop() {
  return (
    <div className="au-flag-backdrop" aria-hidden="true">
      <div className="au-flag-backdrop__grid">
        {TILES.map((code, i) => (
          <span key={`${code}-${i}`} className={`fi fi-${code} au-flag-backdrop__flag`} />
        ))}
      </div>
    </div>
  );
}
