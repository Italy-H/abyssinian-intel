/* ==========================================================================
   reports.js — Classified Mock Dossier Viewer
   --------------------------------------------------------------------------
   Drives the reports.html "intelligence archive terminal":
     - Case directory (sidebar) selects a case file
     - Case file renders into a 4-tab dossier viewer
     - Prev / Next pager walks the tabs like report pages

   ALL CONTENT BELOW IS FICTIONAL AND ILLUSTRATIVE.
   Names, entities, addresses, identifiers, wallets and domains are invented
   for demonstration of report structure only. No real person or organisation
   is described.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Tab labels (shared across all cases) ---------- */
  var TABS = [
    { id: 'summary',   label: 'I · Executive Summary' },
    { id: 'method',    label: 'II · Methodology & Data Graph' },
    { id: 'findings',  label: 'III · Findings & Timeline' },
    { id: 'conclusion',label: 'IV · Analytical Conclusion' }
  ];

  /* ---------- Small markup helpers ---------- */
  function metrics(rows) {
    return '<div class="metrics">' + rows.map(function (r) {
      return '<div class="metric"><span class="metric__label">' + r[0] + '</span>' +
             '<span class="metric__value' + (r[2] ? ' metric__value--cyan' : '') + '">' + r[1] + '</span></div>';
    }).join('') + '</div>';
  }

  function table(caption, head, rows) {
    return '<div class="table-scroll"><table class="data-table"><caption>' + caption + '</caption>' +
      '<thead><tr>' + head.map(function (h) { return '<th scope="col">' + h + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  function bars(rows) {
    return rows.map(function (r) {
      return '<div class="bar"><div class="bar__row"><span>' + r[0] + '</span><span>' + r[1] + '%</span></div>' +
        '<div class="bar__track"><div class="bar__fill' + (r[2] ? ' bar__fill--copper' : '') +
        '" data-bar="' + r[1] + '"></div></div></div>';
    }).join('');
  }

  function timeline(rows) {
    return '<ul class="timeline">' + rows.map(function (r) {
      return '<li><time>' + r[0] + '</time>' + r[1] + '</li>';
    }).join('') + '</ul>';
  }

  var R = '<span class="redact">&nbsp;REDACTED&nbsp;</span>'; // redaction block

  /* ======================================================================
     CASE FILE DATA
     ====================================================================== */
  var CASES = [
    /* ------------------------------------------------------------------ */
    {
      id: '8841',
      title: 'Corporate Asset &amp; Entity Verification',
      client: 'Commercial client · Tier 06 Bespoke',
      opened: '2026-02-11',
      closed: '2026-02-24',
      stamp: 'THREAT LEVEL: MODERATE',
      stampClass: 'stamp--amber',
      analyst: 'ANALYST-04',

      summary:
        metrics([
          ['Case Class', 'ENTITY DD'],
          ['Scope Days', '9'],
          ['Entities Mapped', '14', true],
          ['Confidence', 'HIGH', true]
        ]) +
        '<h3>Objective</h3>' +
        '<p>Client — a ' + R + ' investment group evaluating a proposed joint venture — requested verification of the ' +
        'corporate standing, ownership structure, and publicly recorded asset position of a counterparty entity ' +
        'referred to in this dossier as <strong>SUBJECT ENTITY A</strong> (' + R + ' Holdings LLC, registered ' + R + ').</p>' +
        '<h3>Scope Boundaries</h3>' +
        '<ul>' +
        '<li><strong>In scope:</strong> secretary-of-state registry filings, UCC lien indices, county property records, ' +
        'federal and state civil court dockets, published regulatory actions, public financial disclosures, and ' +
        'open-source corporate reporting.</li>' +
        '<li><strong>Out of scope:</strong> non-public financial statements, banking records, tax filings, and any ' +
        'material not lawfully available from open or public sources. No surveillance or human-source collection ' +
        'was conducted or offered.</li>' +
        '</ul>' +
        '<h3>Short Answer</h3>' +
        '<p>Subject Entity A is validly registered and in good standing, but its presented ownership narrative is ' +
        '<strong>materially incomplete</strong>. Two undisclosed affiliated entities share a registered agent, a ' +
        'principal officer, and a mailing address with the subject. One affiliate carries an unsatisfied civil ' +
        'judgment. Client should treat the ownership representation as unreliable pending direct disclosure.</p>' +
        '<div class="notice notice--red mt-2"><span class="notice__title">Mock Dossier Notice</span>' +
        '<p class="mb-0 small">This is a fictional demonstration file. All identifiers, entities and events are invented ' +
        'to illustrate report structure and formatting. No real organisation is described.</p></div>',

      method:
        '<h3>Collection Sources</h3>' +
        table('Source register — Case 8841', ['Source Category', 'Records Pulled', 'Jurisdiction', 'Confidence'], [
          ['Secretary of State business registry', '14 filings', R + ' (3 states)', 'Confirmed'],
          ['UCC-1 financing statement index', '6 filings', 'State-level', 'Confirmed'],
          ['County recorder — deeds &amp; mortgages', '9 instruments', '4 counties', 'Confirmed'],
          ['Federal civil docket (PACER index)', '3 matters', 'Federal', 'Confirmed'],
          ['State civil &amp; judgment index', '5 matters', 'State', 'Corroborated'],
          ['Regulatory action databases', '0 hits', 'Federal + state', 'Confirmed (negative)'],
          ['Adverse media / trade press archive', '11 articles', 'Open web', 'Indicative']
        ]) +
        '<h3>Correlation Node Strength</h3>' +
        '<p class="small dim">Strength of the link between Subject Entity A and each correlated node, expressed as ' +
        'analyst confidence that the relationship is real and material.</p>' +
        bars([
          ['Shared registered agent → Affiliate B', 98],
          ['Shared principal officer → Affiliate B', 94],
          ['Shared mailing address → Affiliate C', 89],
          ['Common UCC secured party → Affiliate B/C', 81],
          ['Property co-titling → Affiliate C', 72],
          ['Trade-press co-mention (unconfirmed)', 38, true]
        ]) +
        '<h3>Method Limitations</h3>' +
        '<p>Beneficial ownership beyond the registered-agent layer is not a matter of public record in two of the three ' +
        'relevant jurisdictions. Where ownership is asserted in this dossier, it is asserted from filed officer and ' +
        'organiser designations only, not from verified equity records.</p>',

      findings:
        table('Verified entity register', ['Designation', 'Status', 'Formed', 'Registered Agent', 'Confidence'], [
          ['SUBJECT ENTITY A', 'Active / good standing', '2019-06', 'Agent ' + R, 'Confirmed'],
          ['AFFILIATE B', 'Active', '2020-01', 'Agent ' + R + ' (same)', 'Confirmed'],
          ['AFFILIATE C', 'Active', '2021-08', 'Agent ' + R + ' (same)', 'Confirmed'],
          ['AFFILIATE D', 'Administratively dissolved', '2017-03', 'Agent ' + R, 'Confirmed'],
          ['ENTITY E (name-similar)', 'Unrelated — excluded', '2015-11', '—', 'Confirmed negative']
        ]) +
        table('Publicly recorded asset position', ['Instrument', 'Recorded', 'Held By', 'Encumbrance', 'Confidence'], [
          ['Commercial deed — parcel ' + R, '2020-04-17', 'Subject Entity A', 'Mortgage, active', 'Confirmed'],
          ['Commercial deed — parcel ' + R, '2021-11-02', 'Affiliate C', 'Mortgage + UCC lien', 'Confirmed'],
          ['UCC-1 financing statement', '2022-03-09', 'Subject Entity A', 'Equipment collateral', 'Confirmed'],
          ['UCC-1 financing statement', '2023-07-21', 'Affiliate B', 'Blanket lien, all assets', 'Confirmed'],
          ['Residential deed — ' + R, '2018-09-30', 'Officer (individual)', 'None recorded', 'Corroborated']
        ]) +
        '<h3>Event Timeline</h3>' +
        timeline([
          ['2019-06-14', 'Subject Entity A organised in ' + R + '. Officer ' + R + ' listed as sole organiser.'],
          ['2020-01-22', '<strong>Affiliate B</strong> organised using the identical registered agent and mailing address. Not disclosed in client-provided materials.'],
          ['2020-04-17', 'Commercial parcel acquired by Subject Entity A. Recorded mortgage, principal ' + R + '.'],
          ['2021-08-05', '<strong>Affiliate C</strong> organised. Shares mailing address with Subject Entity A; officer overlap confirmed via filed annual report.'],
          ['2022-03-09', 'UCC-1 filed against Subject Entity A equipment collateral by secured party ' + R + '.'],
          ['2023-07-21', 'Blanket UCC-1 filed against <strong>Affiliate B</strong> — all assets — by the same secured party.'],
          ['2024-05-30', '<strong>Unsatisfied civil judgment</strong> entered against Affiliate B in state court, amount ' + R + '. No satisfaction of judgment recorded as of collection date.'],
          ['2025-10-08', 'Subject Entity A annual report filed on time; good standing maintained. No disclosure of affiliate relationships.'],
          ['2026-02-22', 'Collection closed. All records re-verified against live registry state.']
        ]) +
        '<div class="notice"><span class="notice__title">Negative Findings (Reported For Completeness)</span>' +
        '<p class="mb-0 small">No federal or state regulatory enforcement action was located against any mapped entity. ' +
        'No bankruptcy filing was located. No criminal matter was located in any searched public index. Absence of a ' +
        'public record is not proof of absence of an event.</p></div>',

      conclusion:
        '<h3>Risk Matrix</h3>' +
        table('Assessed risk by vector', ['Vector', 'Assessment', 'Basis', 'Confidence'], [
          ['Entity legitimacy', '<span style="color:var(--cyan)">LOW RISK</span>', 'Valid registration, continuous good standing, timely filings', 'High'],
          ['Ownership transparency', '<span style="color:#E88B87">ELEVATED RISK</span>', 'Two material affiliates undisclosed in client materials', 'High'],
          ['Encumbrance exposure', '<span style="color:var(--bronze)">MODERATE RISK</span>', 'Blanket lien on affiliate; cross-collateral structure plausible', 'Medium'],
          ['Litigation exposure', '<span style="color:var(--bronze)">MODERATE RISK</span>', 'Unsatisfied judgment against affiliate, same officer', 'High'],
          ['Regulatory exposure', '<span style="color:var(--cyan)">LOW RISK</span>', 'No enforcement actions located', 'Medium']
        ]) +
        '<h3>What the Evidence Supports</h3>' +
        '<p>The record supports a finding that Subject Entity A, Affiliate B and Affiliate C are operationally related ' +
        'through shared agent, officer and address, and that a material unsatisfied judgment sits against one of them. ' +
        'It supports treating the counterparty group, not the single entity, as the real unit of risk.</p>' +
        '<h3>What the Evidence Does Not Support</h3>' +
        '<p>The record does <em>not</em> establish beneficial ownership, common control in a legal sense, fraudulent intent, ' +
        'or any commingling of funds. Those questions require disclosure or discovery and cannot be resolved from ' +
        'open sources. No inference of wrongdoing should be drawn from structure alone.</p>' +
        '<h3>Recommended Next Steps</h3>' +
        '<ul>' +
        '<li>Request written disclosure of all affiliated entities and common officers as a condition precedent.</li>' +
        '<li>Require a lien and judgment search warranty, with representation covering affiliates, in transaction documents.</li>' +
        '<li>Obtain counsel review of the blanket UCC filing for cross-collateralisation before capital is committed.</li>' +
        '<li>Optional: 90-day monitoring retainer on new filings across all mapped entities (Tier 06).</li>' +
        '</ul>' +
        '<div class="notice notice--cyan mt-2"><span class="notice__title">Analyst Attestation</span>' +
        '<p class="mb-0 small">All findings derived from lawfully accessible public records and open sources. No licensed ' +
        'private investigative activity, surveillance, or pretexting was conducted. This dossier is analytical work ' +
        'product, not a consumer report and not legal advice.</p></div>'
    },

    /* ------------------------------------------------------------------ */
    {
      id: '9023',
      title: 'Comprehensive Digital Footprint &amp; Risk Vetting',
      client: 'Business client · Tier 03 Workforce Vetting',
      opened: '2026-04-02',
      closed: '2026-04-09',
      stamp: 'THREAT LEVEL: LOW',
      stampClass: 'stamp--cyan',
      analyst: 'ANALYST-02',

      summary:
        metrics([
          ['Case Class', 'PRE-HIRE DD'],
          ['Scope Days', '5'],
          ['Data Points', '68', true],
          ['Confidence', 'HIGH', true]
        ]) +
        '<h3>Objective</h3>' +
        '<p>Client — a ' + R + '-person professional services firm — requested credential verification and public ' +
        'reputational review for a finalist candidate for a senior, client-facing position, referred to here as ' +
        '<strong>SUBJECT M</strong>. Candidate consent to open-source vetting was obtained and documented by the ' +
        'client prior to engagement.</p>' +
        '<h3>Scope Boundaries</h3>' +
        '<ul>' +
        '<li><strong>In scope:</strong> public professional licensure records, educational credential verification, ' +
        'corporate affiliation filings, published works, public professional profiles, adverse media, and public ' +
        'court indices.</li>' +
        '<li><strong>Out of scope:</strong> credit data, medical data, private communications, protected class ' +
        'characteristics, and anything requiring FCRA permissible purpose. This is <em>not</em> a consumer report.</li>' +
        '</ul>' +
        '<h3>Short Answer</h3>' +
        '<p>Subject M\'s stated credentials are <strong>substantially verified</strong>. One date discrepancy (an ' +
        'employment gap presented as continuous) and one unverifiable claim (an award with no traceable issuing body) ' +
        'were identified. Neither is disqualifying on its face; both are worth a direct question in a final interview.</p>' +
        '<div class="notice notice--red mt-2"><span class="notice__title">Mock Dossier Notice</span>' +
        '<p class="mb-0 small">Fictional demonstration file. All identifiers and events are invented to illustrate ' +
        'report structure. No real person is described.</p></div>',

      method:
        '<h3>Collection Sources</h3>' +
        table('Source register — Case 9023', ['Source Category', 'Queries', 'Result', 'Confidence'], [
          ['State professional licensure registry', '4', 'Licence active, no discipline', 'Confirmed'],
          ['Degree / registrar verification service', '2', 'Both degrees confirmed', 'Confirmed'],
          ['Corporate registry — officer/director index', '6', '2 affiliations located', 'Confirmed'],
          ['Public court index — civil', '5 jurisdictions', 'No matter located', 'Confirmed (negative)'],
          ['Adverse media archive', '—', 'No adverse coverage', 'Confirmed (negative)'],
          ['Published works / conference record', '—', '9 items, consistent', 'Corroborated'],
          ['Public professional profile consistency', '—', '1 date discrepancy', 'Corroborated'],
          ['Award issuing body verification', '3', 'No issuing body located', 'Unverified — flagged']
        ]) +
        '<h3>Footprint Correlation Nodes</h3>' +
        bars([
          ['Name → licence record identity match', 97],
          ['Name → registrar credential match', 96],
          ['Professional profile → employer filings', 88],
          ['Published works → claimed expertise', 84],
          ['Stated timeline → documented timeline', 71, true],
          ['Claimed award → traceable issuer', 12, true]
        ]) +
        '<h3>Method Limitations</h3>' +
        '<p>Employment history prior to the subject\'s current jurisdiction of residence is verifiable only where a ' +
        'former employer is a filed entity or the role produced a public record. Two early-career roles could not be ' +
        'independently corroborated and are reported as <em>unverified</em>, not as adverse.</p>',

      findings:
        table('Credential verification matrix', ['Claim', 'Source Verified Against', 'Result', 'Confidence'], [
          ['Graduate degree, ' + R + ' (2011)', 'Registrar verification', 'Verified — exact match', 'Confirmed'],
          ['Undergraduate degree, ' + R + ' (2008)', 'Registrar verification', 'Verified — exact match', 'Confirmed'],
          ['Professional licence #' + R, 'State licensure registry', 'Active, no disciplinary history', 'Confirmed'],
          ['Senior role, ' + R + ' (2019–2024)', 'Corporate filings + public record', 'Verified', 'Confirmed'],
          ['Role, ' + R + ' (2016–2019)', 'Corporate filings', 'Verified, dates adjusted', 'Corroborated'],
          ['Continuous employment 2014–2016', 'Multiple sources', '<span style="color:var(--bronze)">Discrepancy — gap of ~7 months</span>', 'Corroborated'],
          ['Industry award, ' + R + ' (2021)', 'Issuer search, press archive', '<span style="color:#E88B87">No issuing body located</span>', 'Unverified'],
          ['Early role, ' + R + ' (2009–2011)', '—', 'No public record available', 'Unverified']
        ]) +
        '<h3>Verified Chronology</h3>' +
        timeline([
          ['2008-05', 'Undergraduate degree conferred. Registrar-confirmed.'],
          ['2011-06', 'Graduate degree conferred. Registrar-confirmed.'],
          ['2012-03', 'Professional licence issued, ' + R + '. Continuously active since; no lapse, no discipline.'],
          ['2014-01 → 2014-08', '<strong>Documented gap.</strong> No employer of record located for approximately seven months. Presented as continuous in candidate materials.'],
          ['2016-09', 'Joined ' + R + '. Start date differs from stated by two months — immaterial.'],
          ['2019-04', 'Joined ' + R + ' in senior capacity. Confirmed by corporate filing and contemporaneous press.'],
          ['2021-11', 'Claimed industry award. No issuing organisation, press record, or registry entry located.'],
          ['2024-02', 'Departure from ' + R + '. No adverse circumstance located in any public source.'],
          ['2026-04-08', 'Collection closed. Licence status re-verified live.']
        ]) +
        '<div class="notice"><span class="notice__title">Negative Findings (Reported For Completeness)</span>' +
        '<p class="mb-0 small">No civil litigation, judgment, lien, bankruptcy, regulatory action, or disciplinary ' +
        'proceeding was located in any searched public index across five jurisdictions. No adverse media coverage ' +
        'was located. Absence of a public record is not proof of absence of an event.</p></div>',

      conclusion:
        '<h3>Risk Matrix</h3>' +
        table('Assessed risk by vector', ['Vector', 'Assessment', 'Basis', 'Confidence'], [
          ['Credential authenticity', '<span style="color:var(--cyan)">LOW RISK</span>', 'Degrees and licence independently verified', 'High'],
          ['Professional standing', '<span style="color:var(--cyan)">LOW RISK</span>', 'Active licence, zero disciplinary history', 'High'],
          ['Timeline accuracy', '<span style="color:var(--bronze)">MINOR CONCERN</span>', 'One undisclosed ~7-month gap', 'Medium'],
          ['Claim substantiation', '<span style="color:var(--bronze)">MINOR CONCERN</span>', 'One award claim with no traceable issuer', 'Medium'],
          ['Reputational exposure', '<span style="color:var(--cyan)">LOW RISK</span>', 'No adverse media or litigation located', 'Medium'],
          ['Conflict of interest', '<span style="color:var(--cyan)">LOW RISK</span>', 'Two affiliations, neither competitive with client', 'High']
        ]) +
        '<h3>What the Evidence Supports</h3>' +
        '<p>Subject M is who they represent themselves to be, holds the credentials claimed, and carries no located ' +
        'public adverse history. The core hiring risk question — credential fraud — is answered negatively with high ' +
        'confidence.</p>' +
        '<h3>What the Evidence Does Not Support</h3>' +
        '<p>Two flagged items are <strong>discrepancies, not findings of dishonesty</strong>. Employment gaps have ' +
        'ordinary explanations (caregiving, health, education, redundancy) that are frequently private and, in several ' +
        'categories, legally protected from inquiry. An unlocatable award may reflect a defunct, regional, or ' +
        'internal issuer rather than a fabrication. The evidence does not support an adverse inference on either point.</p>' +
        '<h3>Recommended Next Steps</h3>' +
        '<ul>' +
        '<li>Ask the candidate directly about both items in the final interview. Their answer is more informative than further research.</li>' +
        '<li>Do not treat this dossier as a consumer report; for any FCRA-governed adverse action, engage a compliant consumer reporting agency and follow the required disclosure, authorisation and pre-adverse-action process.</li>' +
        '<li>Document the business-related rationale for any decision, and apply the same vetting standard to all finalists.</li>' +
        '<li>Retain reference checks as the primary means of assessing performance history — OSINT does not substitute for them.</li>' +
        '</ul>' +
        '<div class="notice notice--cyan mt-2"><span class="notice__title">Analyst Attestation</span>' +
        '<p class="mb-0 small">Collection limited to lawfully accessible public and open sources, with documented ' +
        'candidate consent held by the client. No protected-class characteristic was collected, considered, or ' +
        'reported. Not a consumer report. Not legal advice.</p></div>'
    },

    /* ------------------------------------------------------------------ */
    {
      id: '7419',
      title: 'Digital Trace &amp; Fraud Vector Analysis',
      client: 'Private individual · Tier 05 Fraud Trace',
      opened: '2026-01-19',
      closed: '2026-02-03',
      stamp: 'THREAT LEVEL: HIGH',
      stampClass: 'stamp--red',
      analyst: 'ANALYST-01',

      summary:
        metrics([
          ['Case Class', 'FRAUD TRACE'],
          ['Scope Days', '11'],
          ['Hops Mapped', '23', true],
          ['Confidence', 'MEDIUM-HIGH']
        ]) +
        '<h3>Objective</h3>' +
        '<p>Client, a private individual, reported losses totalling ' + R + ' to a fraudulent investment platform ' +
        'presented through a months-long social-engineering approach. Engagement objective: reconstruct the incident, ' +
        'map the on-chain movement of funds, characterise the fraud infrastructure, and produce an evidence package ' +
        'suitable for submission to law enforcement and the client\'s financial institution.</p>' +
        '<h3>Scope Boundaries</h3>' +
        '<ul>' +
        '<li><strong>In scope:</strong> client-provided transaction records, public blockchain ledger analysis, ' +
        'domain registration and hosting records, public certificate transparency logs, archived web captures, and ' +
        'public fraud-reporting corpora.</li>' +
        '<li><strong>Out of scope:</strong> any contact with the perpetrators, any attempt to access their systems ' +
        'or accounts, and any representation that funds can be recovered.</li>' +
        '</ul>' +
        '<div class="notice notice--red mt-2"><span class="notice__title">Critical Client Advisory</span>' +
        '<p class="mb-0 small">This is an analysis and documentation service. <strong>We do not recover funds.</strong> ' +
        'Clients who have already lost money to fraud are frequently targeted a second time by "recovery" operations ' +
        'demanding an upfront fee. Any party guaranteeing recovery of your funds for a fee should be treated as a ' +
        'second fraud attempt and reported.</p></div>' +
        '<h3>Short Answer</h3>' +
        '<p>Funds were consolidated across ' + R + ' intermediary addresses and terminated at deposit addresses ' +
        'clustered to <strong>two centralised exchanges</strong>, one of which operates a KYC regime and responds to ' +
        'lawful process. That is the actionable finding: a law-enforcement or bank-initiated request to that venue is ' +
        'the only realistic recovery vector.</p>' +
        '<div class="notice mt-2"><span class="notice__title">Mock Dossier Notice</span>' +
        '<p class="mb-0 small">Fictional demonstration file. All addresses, domains and amounts are invented.</p></div>',

      method:
        '<h3>Collection Sources</h3>' +
        table('Source register — Case 7419', ['Source Category', 'Artefacts', 'Purpose', 'Confidence'], [
          ['Client transaction records', '17 transfers', 'Loss timeline baseline', 'Confirmed'],
          ['Public blockchain ledger', '23 hops', 'Fund flow mapping', 'Confirmed'],
          ['Address clustering heuristics', '9 clusters', 'Common-ownership inference', 'Corroborated'],
          ['Exchange deposit-address attribution', '2 venues', 'Terminal endpoint identification', 'Corroborated'],
          ['WHOIS / registrar records', '6 domains', 'Infrastructure attribution', 'Confirmed'],
          ['Certificate transparency logs', '11 certificates', 'Sibling domain discovery', 'Confirmed'],
          ['Web archive captures', '28 snapshots', 'Platform content preservation', 'Confirmed'],
          ['Public fraud-report corpora', '—', 'Cross-victim pattern matching', 'Indicative']
        ]) +
        '<h3>Vector Attribution Confidence</h3>' +
        bars([
          ['Transfers → client-controlled origin', 99],
          ['Origin → first-hop consolidation address', 96],
          ['Consolidation → mixing/peel chain', 88],
          ['Peel chain → exchange deposit cluster', 79],
          ['Domain set → single operator', 74],
          ['Operator → named real-world identity', 21, true]
        ]) +
        '<h3>Method Limitations</h3>' +
        '<p>Clustering heuristics infer common control from transaction behaviour; they are <strong>probabilistic, not ' +
        'definitive</strong>. Exchange attribution identifies the receiving venue, never the account holder — only the ' +
        'exchange, under lawful process, can map a deposit address to an identity. No real-world identity is asserted ' +
        'anywhere in this dossier, and none should be inferred.</p>',

      findings:
        table('Loss ledger (client-verified)', ['#', 'Date', 'Method', 'Amount', 'Destination Class'], [
          ['01', '2025-09-14', 'Bank wire → exchange', R, 'Client-controlled account'],
          ['02', '2025-09-22', 'On-chain transfer', R, 'Fraud receiving address A'],
          ['03', '2025-10-06', 'On-chain transfer', R, 'Fraud receiving address A'],
          ['04', '2025-10-29', 'On-chain transfer', R, 'Fraud receiving address B'],
          ['05', '2025-11-18', 'On-chain transfer', R, 'Fraud receiving address B'],
          ['06', '2025-12-03', '"Withdrawal fee" demand', R, 'Fraud receiving address C'],
          ['07', '2025-12-19', '"Tax clearance" demand', R, 'Fraud receiving address C']
        ]) +
        table('Infrastructure footprint', ['Artefact', 'Observation', 'Correlation', 'Confidence'], [
          ['Primary platform domain', 'Registered 2025-07, privacy-shielded', 'Registered 8 weeks pre-approach', 'Confirmed'],
          ['Sibling domains (5)', 'Same registrar, same TLS issuer, same day', 'Template infrastructure', 'Confirmed'],
          ['Hosting provider', 'Bulletproof-adjacent, offshore', 'Shared /24 with 3 reported platforms', 'Corroborated'],
          ['Platform UI', 'Identical to 4 archived scam platforms', 'Known fraud kit', 'Corroborated'],
          ['Persona photography', 'Reverse-image match to unrelated public profile', 'Stolen identity imagery', 'Confirmed'],
          ['Support contact', 'Recycled across 3 sibling domains', 'Single operator group', 'Corroborated']
        ]) +
        '<h3>Incident &amp; Flow Timeline</h3>' +
        timeline([
          ['2025-07-11', 'Primary domain registered behind privacy shield. Five sibling domains registered same day.'],
          ['2025-08-30', 'Initial social-engineering contact. Persona presented with stolen profile imagery (reverse-image confirmed).'],
          ['2025-09-14', 'Client funds bank account → exchange. Trust-building phase; small "withdrawal" honoured.'],
          ['2025-09-22 → 2025-11-18', 'Escalating transfers to fraud-controlled addresses A and B across four transactions.'],
          ['2025-11-20', 'Withdrawal request submitted by client. <strong>Denied.</strong> Fee demand issued — the standard inflection point.'],
          ['2025-12-03 → 2025-12-19', 'Two further payments extracted under "fee" and "tax clearance" pretexts.'],
          ['2025-12-24', 'Platform access revoked. Support channels went silent. Domain remained live.'],
          ['2026-01-08', 'Consolidation: addresses A, B, C swept into a single intermediary. Peel chain begins.'],
          ['2026-01-15', '<strong>Terminal deposits</strong> at two centralised exchange clusters. Exchange 1 operates KYC and responds to lawful process; Exchange 2 is non-cooperative.'],
          ['2026-01-19', 'Engagement opened with Vantage Point Investigations.'],
          ['2026-02-02', 'Evidence package compiled: IC3-formatted narrative, annotated flow diagram, full artefact appendix with retrieval hashes.']
        ]),

      conclusion:
        '<h3>Risk &amp; Recovery Matrix</h3>' +
        table('Assessment by vector', ['Vector', 'Assessment', 'Basis', 'Confidence'], [
          ['Fraud confirmed', '<span style="color:#E88B87">CONFIRMED</span>', 'Known fraud kit, stolen imagery, fee-extraction pattern', 'High'],
          ['Organised operation', '<span style="color:#E88B87">HIGH LIKELIHOOD</span>', 'Six-domain infrastructure, shared hosting, recycled support', 'High'],
          ['Terminal endpoint identified', '<span style="color:var(--cyan)">YES — PARTIAL</span>', '2 exchange clusters; 1 KYC-cooperative', 'Medium-High'],
          ['Recovery prospect', '<span style="color:var(--bronze)">LIMITED</span>', 'Depends entirely on law-enforcement action at Exchange 1', 'Medium'],
          ['Re-targeting risk', '<span style="color:#E88B87">HIGH</span>', 'Victim lists are resold; recovery-scam follow-on is near-certain', 'High']
        ]) +
        '<h3>What the Evidence Supports</h3>' +
        '<p>The evidence supports a confident finding of organised investment fraud executed with a reusable platform ' +
        'kit, and it identifies the terminal venue where funds entered a regulated environment. That venue is the ' +
        'single point at which lawful process can plausibly act.</p>' +
        '<h3>What the Evidence Does Not Support</h3>' +
        '<p>Nothing here identifies any individual. Clustering is probabilistic; deposit addresses are not account ' +
        'holders. <strong>No real-world identity is asserted and none may be inferred.</strong> This dossier does not ' +
        'support any private confrontation, public accusation, or self-directed recovery attempt.</p>' +
        '<h3>Recommended Next Steps</h3>' +
        '<ul>' +
        '<li><strong>File immediately</strong> with the appropriate national cybercrime reporting body (in the US, the FBI IC3) and your local police, attaching the supplied evidence package.</li>' +
        '<li>Notify your bank\'s and exchange\'s fraud departments in writing; request that Exchange 1 freeze the identified deposit cluster pending law-enforcement contact. Speed matters more than completeness.</li>' +
        '<li>Engage counsel regarding civil options and any applicable reimbursement obligations of your financial institution.</li>' +
        '<li><strong>Reject all unsolicited recovery offers.</strong> Legitimate recovery does not originate from a cold approach and never requires an upfront fee.</li>' +
        '<li>Rotate credentials and enable hardware-backed multi-factor authentication on all financial accounts.</li>' +
        '</ul>' +
        '<div class="notice notice--cyan mt-2"><span class="notice__title">Analyst Attestation</span>' +
        '<p class="mb-0 small">Analysis derived from client-provided records and public ledger, registration and archival ' +
        'data. No contact with any third party was made on the client\'s behalf. No system was accessed. No recovery ' +
        'outcome is promised or implied. Not legal advice.</p></div>'
    },

    /* ------------------------------------------------------------------ */
    {
      id: '6204',
      title: 'Historical Family Tracing &amp; Reunification',
      client: 'Private individual · Tier 01 Reunification',
      opened: '2025-11-04',
      closed: '2025-11-27',
      stamp: 'THREAT LEVEL: N/A — SENSITIVE',
      stampClass: 'stamp--amber',
      analyst: 'ANALYST-03',

      summary:
        metrics([
          ['Case Class', 'REUNIFICATION'],
          ['Scope Days', '16'],
          ['Records Reviewed', '112', true],
          ['Confidence', 'HIGH', true]
        ]) +
        '<h3>Objective</h3>' +
        '<p>Client sought to locate a maternal half-sibling, separated in early childhood following a family ' +
        'dissolution in ' + R + '. Client held a first name, an approximate birth year, a former city of residence, ' +
        'and one photograph. Objective: establish current locality and confirm identity to a high confidence standard, ' +
        'for the purpose of a voluntary, consent-based approach.</p>' +
        '<h3>Scope Boundaries</h3>' +
        '<ul>' +
        '<li><strong>In scope:</strong> public vital and marriage indices, historical city directories, newspaper and ' +
        'obituary archives, census and genealogical public records, property and voter public records where lawfully ' +
        'available, and open professional/public footprint correlation.</li>' +
        '<li><strong>Out of scope:</strong> sealed adoption records, sealed juvenile records, and any sealed or ' +
        'restricted court file. Where a record is sealed by law, it stays sealed — no workaround is attempted or offered.</li>' +
        '</ul>' +
        '<h3>Short Answer</h3>' +
        '<p>Subject located. Identity confirmed to a high confidence standard through five independent corroborating ' +
        'record chains. <strong>Current contact details were delivered under a consent-first protocol</strong> — see ' +
        'the conclusion section for the approach framework, which the client accepted in writing before delivery.</p>' +
        '<div class="notice notice--cyan mt-2"><span class="notice__title">Ethical Protocol</span>' +
        '<p class="mb-0 small">Reunification engagements are accepted only where there is no indication of a protective ' +
        'order, estrangement by choice, or safety concern. We do not make contact on a client\'s behalf, and we counsel ' +
        'every reunification client that the located party has an absolute right to decline contact.</p></div>' +
        '<div class="notice mt-2"><span class="notice__title">Mock Dossier Notice</span>' +
        '<p class="mb-0 small">Fictional demonstration file. No real person is described.</p></div>',

      method:
        '<h3>Collection Sources</h3>' +
        table('Source register — Case 6204', ['Source Category', 'Records', 'Era', 'Confidence'], [
          ['Public vital index (birth)', '3', '1970s–80s', 'Confirmed'],
          ['Marriage &amp; dissolution index', '6', '1980s–2000s', 'Confirmed'],
          ['Historical city directories', '22', '1978–1996', 'Confirmed'],
          ['Newspaper &amp; obituary archive', '14', '1981–2019', 'Corroborated'],
          ['Census (public release cycles)', '2', 'Historical', 'Confirmed'],
          ['Cemetery &amp; memorial indices', '4', '1990s–2010s', 'Corroborated'],
          ['Property &amp; deed records', '9', '1994–2024', 'Confirmed'],
          ['Public voter / residency records', '5', '2006–2025', 'Confirmed'],
          ['Open professional footprint', '—', 'Current', 'Corroborated']
        ]) +
        '<h3>Identity Confidence Nodes</h3>' +
        '<p class="small dim">Name changes at marriage and a relocation across two states made the primary chain ' +
        'discontinuous. Continuity was re-established through the relative cluster rather than through the subject ' +
        'directly — the standard method where a surname change breaks the trail.</p>' +
        bars([
          ['Birth index → maternal surname match', 95],
          ['Marriage record → surname change chain', 92],
          ['Obituary → relative cluster confirmation', 90],
          ['City directory → residency continuity', 86],
          ['Property record → current locality', 91],
          ['Photograph → public image consistency', 63, true]
        ]) +
        '<h3>Method Limitations</h3>' +
        '<p>Two years of the residency chain (' + R + '–' + R + ') could not be reconstructed from any available ' +
        'public source; the gap is bridged by inference from adjacent records and is disclosed as such. Identity ' +
        'confirmation rests on documentary correlation, not on biological verification — only a consensual DNA test ' +
        'can establish biological relationship, and we recommended one.</p>',

      findings:
        table('Identity correlation chain', ['Link', 'Record', 'Established', 'Confidence'], [
          ['1', 'Public birth index, ' + R + ' County', 'Given name + maternal surname + birth year', 'Confirmed'],
          ['2', 'Dissolution record, ' + R, 'Family separation event and custody split', 'Confirmed'],
          ['3', 'City directory series, 1984–1991', 'Household residency at ' + R, 'Confirmed'],
          ['4', 'Maternal obituary, 2019', '<strong>Named surviving children — bridged the surname change</strong>', 'Confirmed'],
          ['5', 'Marriage record, 1998', 'Surname change from ' + R + ' to ' + R, 'Confirmed'],
          ['6', 'Deed record, 2014', 'Property acquisition, current county of residence', 'Confirmed'],
          ['7', 'Public voter registration, 2025', 'Current residency confirmed, active', 'Confirmed'],
          ['8', 'Open professional footprint', 'Employment and locality consistent with (6) and (7)', 'Corroborated']
        ]) +
        '<h3>Reconstructed Chronology</h3>' +
        timeline([
          ['1981', 'Subject born, ' + R + ' County. Public birth index entry located under maternal surname.'],
          ['1984', 'Family dissolution recorded. Client and subject separated; different custodial households.'],
          ['1984 → 1991', 'Subject household traced continuously through eight city directory editions at ' + R + '.'],
          ['1992 → 1994', '<strong>Gap.</strong> No public record located. Bridged by inference from adjacent records; disclosed as unverified.'],
          ['1996', 'Subject appears in directory record at a new address in an adjacent county.'],
          ['1998', 'Marriage recorded. Surname change — the break that had defeated the client\'s own earlier searches.'],
          ['2014', 'Property acquired in current county of residence. Deed record confirmed.'],
          ['2019', '<strong>Maternal obituary published</strong>, naming surviving children under both surnames. This single record closed the chain.'],
          ['2025', 'Active voter registration confirms current locality.'],
          ['2025-11-26', 'Identity confirmed to high confidence. Consent-first approach protocol delivered with the dossier.']
        ]) +
        '<div class="notice"><span class="notice__title">Sensitivity Handling</span>' +
        '<p class="mb-0 small">Subject\'s full address, telephone number and employer are withheld from this ' +
        'demonstration file and were, in the live engagement, delivered under the restricted-disclosure protocol ' +
        'described in the conclusion. Reunification dossiers are structured so that locating information is ' +
        'separable from the analysis and can be withheld if circumstances change.</p></div>',

      conclusion:
        '<h3>Outcome Matrix</h3>' +
        table('Assessment by vector', ['Vector', 'Assessment', 'Basis', 'Confidence'], [
          ['Identity confirmation', '<span style="color:var(--cyan)">CONFIRMED</span>', 'Five independent corroborating record chains', 'High'],
          ['Current locality', '<span style="color:var(--cyan)">CONFIRMED</span>', 'Deed + active voter registration + footprint', 'High'],
          ['Biological relationship', '<span style="color:var(--bronze)">DOCUMENTARY ONLY</span>', 'Records establish family relation, not biology', 'Medium'],
          ['Safety / protective concern', '<span style="color:var(--cyan)">NONE LOCATED</span>', 'No order, no adverse indicator in any index', 'Medium'],
          ['Contact receptivity', '<span style="color:var(--bronze)">UNKNOWN</span>', 'Not knowable from any record', '—']
        ]) +
        '<h3>What the Evidence Supports</h3>' +
        '<p>The record supports, at high confidence, that the located individual is the client\'s maternal half-sibling ' +
        'and that their current locality is correctly identified. The 2019 obituary is the load-bearing document: it ' +
        'independently names both siblings and bridges the surname change that had blocked every prior search.</p>' +
        '<h3>What the Evidence Does Not Support</h3>' +
        '<p>Records establish a documented family relationship, not a biological one. Nor does any record indicate ' +
        'whether the subject knows of the client, remembers the separation, or wishes to be contacted. ' +
        '<strong>The subject\'s willingness to engage is unknown and unknowable from open sources.</strong></p>' +
        '<h3>Consent-First Approach Protocol (Recommended)</h3>' +
        '<ul>' +
        '<li><strong>Written first, never a doorstep or a call.</strong> A short, calm letter allows the recipient to process the news privately and decide on their own timeline.</li>' +
        '<li><strong>Identify yourself plainly</strong> and state how you located them. Concealing the method reads as surveillance and rarely survives the first conversation.</li>' +
        '<li><strong>Offer an exit in the first paragraph</strong> — an explicit statement that no reply is required and that silence will be respected without further contact.</li>' +
        '<li><strong>One approach only.</strong> If there is no response, do not send a second letter, contact relatives, employers or neighbours, or approach through social platforms. Repeated contact after silence can constitute harassment.</li>' +
        '<li><strong>Prepare for any outcome</strong>, including a decline. Consider a counsellor experienced in reunification before sending — the emotional variance here is wide in both directions.</li>' +
        '<li><strong>If contact is welcomed</strong>, a consensual DNA test is the only way to confirm biological relationship; propose it as a shared step, never as a precondition.</li>' +
        '</ul>' +
        '<div class="notice notice--cyan mt-2"><span class="notice__title">Analyst Attestation</span>' +
        '<p class="mb-0 small">All records were obtained from lawfully accessible public and archival sources. No sealed ' +
        'record was sought or accessed. No contact was made with the subject or any third party on the client\'s behalf. ' +
        'The located party\'s right to decline contact is absolute, and the client acknowledged it in writing before ' +
        'locating information was released. Not legal advice.</p></div>'
    }
  ];

  /* ======================================================================
     VIEWER
     ====================================================================== */
  var state = { caseIndex: 0, tabIndex: 0 };

  var els = {};

  function buildDirectory() {
    els.list.innerHTML = CASES.map(function (c, i) {
      return '<button class="case-btn' + (i === 0 ? ' is-active' : '') + '" type="button" ' +
             'data-case="' + i + '" role="tab" aria-selected="' + (i === 0) + '">' +
             '<span class="case-btn__id">CASE #' + c.id + '</span>' +
             '<span class="case-btn__title">' + c.title + '</span></button>';
    }).join('');

    els.list.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-case]');
      if (!btn) return;
      selectCase(parseInt(btn.getAttribute('data-case'), 10), 0);
    });
  }

  function buildTabs() {
    els.tabs.innerHTML = TABS.map(function (t, i) {
      return '<button class="tab' + (i === 0 ? ' is-active' : '') + '" type="button" role="tab" ' +
             'aria-selected="' + (i === 0) + '" data-tab="' + i + '">' + t.label + '</button>';
    }).join('');

    els.tabs.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-tab]');
      if (!btn) return;
      selectTab(parseInt(btn.getAttribute('data-tab'), 10));
    });

    // Keyboard navigation across tabs
    els.tabs.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      selectTab(state.tabIndex + (e.key === 'ArrowRight' ? 1 : -1));
      els.tabs.querySelector('.tab.is-active').focus();
    });
  }

  function renderCase() {
    var c = CASES[state.caseIndex];

    els.title.innerHTML = 'Case #' + c.id + ' — ' + c.title;
    els.meta.innerHTML =
      'Client: ' + c.client + ' &nbsp;·&nbsp; Opened: ' + c.opened +
      ' &nbsp;·&nbsp; Closed: ' + c.closed + ' &nbsp;·&nbsp; ' + c.analyst;
    els.stamp.className = 'stamp ' + c.stampClass;
    els.stamp.textContent = c.stamp;

    els.body.innerHTML =
      '<div class="panel" id="panel-summary"    role="tabpanel">' + c.summary    + '</div>' +
      '<div class="panel" id="panel-method"     role="tabpanel" hidden>' + c.method     + '</div>' +
      '<div class="panel" id="panel-findings"   role="tabpanel" hidden>' + c.findings   + '</div>' +
      '<div class="panel" id="panel-conclusion" role="tabpanel" hidden>' + c.conclusion + '</div>';

    // directory active state
    els.list.querySelectorAll('.case-btn').forEach(function (b, i) {
      b.classList.toggle('is-active', i === state.caseIndex);
      b.setAttribute('aria-selected', String(i === state.caseIndex));
    });
  }

  function renderTab() {
    var panels = els.body.querySelectorAll('.panel');
    panels.forEach(function (p, i) { p.hidden = i !== state.tabIndex; });

    els.tabs.querySelectorAll('.tab').forEach(function (t, i) {
      t.classList.toggle('is-active', i === state.tabIndex);
      t.setAttribute('aria-selected', String(i === state.tabIndex));
    });

    els.pageLabel.textContent = 'Page ' + (state.tabIndex + 1) + ' of ' + TABS.length +
      ' · Case #' + CASES[state.caseIndex].id;
    els.prev.disabled = state.tabIndex === 0;
    els.next.disabled = state.tabIndex === TABS.length - 1;

    // Re-run bar animations for whatever is now visible
    if (window.VPI && window.VPI.animateBars) {
      window.VPI.animateBars(panels[state.tabIndex]);
    }
  }

  function selectCase(i, tab) {
    state.caseIndex = Math.max(0, Math.min(CASES.length - 1, i));
    state.tabIndex = tab || 0;
    renderCase();
    renderTab();
    // Keep the dossier in view on mobile, where the directory sits above it.
    if (window.matchMedia('(max-width: 900px)').matches) {
      els.dossier.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function selectTab(i) {
    state.tabIndex = Math.max(0, Math.min(TABS.length - 1, i));
    renderTab();
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    els.list      = document.getElementById('case-list');
    els.tabs      = document.getElementById('dossier-tabs');
    els.body      = document.getElementById('dossier-body');
    els.title     = document.getElementById('dossier-title');
    els.meta      = document.getElementById('dossier-meta');
    els.stamp     = document.getElementById('dossier-stamp');
    els.pageLabel = document.getElementById('dossier-page');
    els.prev      = document.getElementById('dossier-prev');
    els.next      = document.getElementById('dossier-next');
    els.dossier   = document.getElementById('dossier');

    if (!els.list || !els.body) return;

    buildDirectory();
    buildTabs();

    els.prev.addEventListener('click', function () { selectTab(state.tabIndex - 1); });
    els.next.addEventListener('click', function () { selectTab(state.tabIndex + 1); });

    // Deep link support: reports.html#case-9023
    var hash = (window.location.hash || '').replace('#case-', '');
    var idx = CASES.findIndex(function (c) { return c.id === hash; });
    selectCase(idx > -1 ? idx : 0, 0);
  });
})();