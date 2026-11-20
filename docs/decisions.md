# Design decisions

Each entry records what was decided, why, and what it costs.

## D-001: Analyse on the device, with no server

**Decision:** all detection runs in the browser.
**Why:** people paste private messages (names, account numbers, OTPs). Not sending them anywhere removes a whole class of privacy and security risk, and makes hosting free.
**Cost:** no live reputation lookups (known-bad numbers or domains) and no model that learns from reports.

## D-002: Rules instead of a machine-learning model

**Decision:** a weighted set of regular-expression signals, link checks and combination rules.
**Why:** users need to see *why* a message is flagged; each point of the score maps to a highlighted phrase. Rules also work offline, are small, and can be reviewed in a pull request.
**Cost:** new wording that no rule covers can be missed, and every new pattern has to be written by hand (see `CONTRIBUTING.md`).

## D-003: A saturating score

**Decision:** `score = 100 × (1 − e^(−raw/45))`, with "Suspicious" from 20 and "Very likely a SCAM" from 55.
**Why:** one strong sign gives about 50 (stop and check); two or three independent signs push past 55. The curve never reaches 100, so the app never claims certainty.
**Cost:** single-tactic scams stay at "Suspicious" (11 of 30 in the evaluation set).

## D-004: Never show a low score as "safe"

**Decision:** the lowest verdict reads "No obvious scam signs", followed by advice to verify the sender.
**Why:** a rule engine cannot prove a message is genuine. Saying "safe" would be a false promise.

## D-005: Classify the scam type only when risk is not low

**Decision:** the scam family is shown only for "Suspicious" or "Very likely a SCAM", and only with at least two keyword hits.
**Why:** naming a scam on a harmless message would alarm people; a missing type is better than a wrong one.
**Cost:** 4 of 19 high-risk evaluation messages got no type.

## D-006: English and Hindi from the start

**Decision:** every interface string, explanation and tip exists in both languages, and the rules include Hindi and Hinglish patterns.
**Why:** the most targeted groups (older adults, first-time digital-payment users) are often more comfortable in Hindi.
**Cost:** every change to user-facing text must be made twice.

## D-007: Complaint draft always in English

**Decision:** the "Copy complaint draft" text is English regardless of interface language.
**Why:** it is pasted into cybercrime.gov.in or read to the 1930 helpline, where English is the common format.

## D-008: No build step, no dependencies

**Decision:** plain ES modules served as they are; tests use Node's built-in `node:test`.
**Why:** nothing to install or update, nothing in the supply chain, and the deployed files are the files in the repository.

## D-009: Evaluate on messages written after the rules

**Decision:** `eval/messages.json` was written after the rules, and the rules were not changed after seeing the results.
**Why:** tuning rules to the test set would make the published numbers meaningless.
**Cost:** the published results include known misses; they are listed in the README.
