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
      client: 'Commercial client · Tier 06 Bespoke · 12 analyst hours @ $95',
      opened: '2026-02-11',
      closed: '2026-02-24',
      stamp: 'THREAT LEVEL: MODERATE',
      stampClass: 'stamp--amber',
      analyst: 'LEAD ANALYST',

      summary:
        metrics([
          ['Case Class', 'ENTITY DD'],
          ['Analyst Hours', '12'],
          ['Entities Mapped', '9', true],
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
          ['Secretary of State business registry', '9 filings', R + ' (3 states)', 'Confirmed'],
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
      client: 'Business client · Tier 03 Workforce Vetting · $165',
      opened: '2026-04-02',
      closed: '2026-04-09',
      stamp: 'THREAT LEVEL: LOW',
      stampClass: 'stamp--cyan',
      analyst: 'LEAD ANALYST',

      summary:
        metrics([
          ['Case Class', 'PRE-HIRE DD'],
          ['Analyst Hours', '3'],
          ['Data Points', '41', true],
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
      id: 'OF-01',
      title: 'Verify a Platform Before You Send Money',
      client: 'Public reference file · not a client engagement',
      opened: 'Published 2026-09',
      closed: 'Maintained',
      stamp: 'VERIFIED PUBLIC SOURCES',
      stampClass: 'stamp--cyan',
      analyst: 'LEAD ANALYST',

      summary:
        '<div class="notice notice--cyan mb-2"><span class="notice__title">This File Is Real</span>' +
        '<p class="mb-0 small">Unlike the other files in this archive, <strong>nothing here is invented</strong>. ' +
        'Every source named below is a live, official, publicly searchable registry, linked so you can run the ' +
        'check yourself. No private individual or company is named, because the file documents a <em>method</em>, ' +
        'not an accusation.</p></div>' +
        metrics([
          ['File Type', 'METHOD'],
          ['Sources', '6 official', true],
          ['Cost To Run', 'FREE'],
          ['Time', '~20 min', true]
        ]) +
        '<h3>Objective</h3>' +
        '<p>Answer one question before money moves: <strong>can this investment platform, broker, or "advisor" be ' +
        'verified against the public record at all?</strong> Most investment-fraud losses we are asked to trace ' +
        'afterwards were avoidable at this step — not because the victim was careless, but because nobody had ever ' +
        'shown them which six places to look, or what each one actually proves.</p>' +
        '<h3>Why We Publish This</h3>' +
        '<p>It is the work we would bill for under Tier 05, given away. Two reasons. First, a trace after the fact ' +
        'recovers money far less often than a check beforehand prevents the loss — we would rather you never needed ' +
        'us. Second, it shows you exactly how we work: named sources, stated limits, and an explicit line between ' +
        'what a record proves and what it merely suggests.</p>' +
        '<h3>What This File Cannot Do</h3>' +
        '<p>It cannot tell you an investment is <em>safe</em>. Registration is not endorsement, and a clean check ' +
        'is not a green light — registered firms defraud people too. What it reliably catches is the large class of ' +
        'operations that <strong>cannot survive contact with a public registry at all</strong>: the ones claiming ' +
        'a registration they do not hold, a regulator that does not exist, or an address that belongs to somebody else.</p>',

      method:
        '<h3>The Six Sources</h3>' +
        '<p class="small dim">All free, all official, all searchable by name. Run them in this order — the cheap ' +
        'checks first, so an obvious failure ends the exercise in two minutes.</p>' +
        table('Verification source register', ['#', 'Source', 'What it answers', 'Operator'], [
          ['1', '<a href="https://www.investor.gov/" target="_blank" rel="noopener">Investor.gov</a> search',
           'Is this firm or person registered to sell investments in the US?', 'SEC'],
          ['2', '<a href="https://brokercheck.finra.org/" target="_blank" rel="noopener">FINRA BrokerCheck</a>',
           'Licence history, employment record, disclosed complaints and disciplinary events', 'FINRA'],
          ['3', '<a href="https://www.sec.gov/enforcement-litigation/public-alerts-unregistered-soliciting-entities" target="_blank" rel="noopener">SEC PAUSE list</a>',
           'Has the SEC already publicly flagged this name for deceptive solicitation?', 'SEC'],
          ['4', '<a href="https://www.cftc.gov/LearnAndProtect/Resources/Check/redlist.htm" target="_blank" rel="noopener">CFTC RED List</a>',
           'Foreign entity apparently acting without required CFTC registration', 'CFTC'],
          ['5', '<a href="https://www.nfa.futures.org/BasicNet/" target="_blank" rel="noopener">NFA BASIC</a>',
           'Futures, forex and commodity-pool registration and disciplinary record', 'NFA'],
          ['6', 'State securities regulator + <a href="https://www.sec.gov/edgar/search/" target="_blank" rel="noopener">EDGAR full-text search</a>',
           'State-level registration, advisories, and whether any filing exists at all', 'State / SEC']
        ]) +
        '<h3>Reading the PAUSE List Correctly</h3>' +
        '<p>The SEC publishes three distinct categories, and conflating them is the commonest amateur error:</p>' +
        '<ul>' +
        '<li><strong>Unregistered soliciting entities</strong> — falsely claim registration, licensing, or a US location.</li>' +
        '<li><strong>Fictitious regulators</strong> — invented agencies and "international commissions" that do not exist. ' +
        'These exist to be cited by the first category as proof of legitimacy.</li>' +
        '<li><strong>Impersonators of genuine firms</strong> — here the listed name is the <em>victim</em>. A real firm\'s ' +
        'identity has been appropriated for a fake site or cold-calling script.</li>' +
        '</ul>' +
        '<div class="notice notice--red"><span class="notice__title">Reproduced Verbatim — SEC</span>' +
        '<p class="mb-0 small">Inclusion on the PAUSE list "does not mean that the SEC has concluded that a violation ' +
        'of the US securities laws has occurred." The list also "does not include all unregistered entities, ' +
        'impersonators of genuine firms, fake regulators, or entities that have been the subject of complaints." ' +
        '<strong>Absence from the list proves nothing.</strong></p></div>' +
        '<div class="notice notice--red"><span class="notice__title">Reproduced Verbatim — CFTC</span>' +
        '<p class="mb-0 small">Inclusion on the RED List "does not mean that the CFTC or a court has concluded that a ' +
        'violation of any provision of the Commodity Exchange Act or the Commission\'s Regulations has occurred." ' +
        'The list is built from public tips and leads, so it is necessarily incomplete.</p></div>' +
        '<h3>Supporting Checks (No Registry Required)</h3>' +
        bars([
          ['Domain registered within 6 months of first contact', 88],
          ['Registrant identity hidden behind privacy shield', 61, true],
          ['Sibling domains sharing registrar, host and TLS issuer', 79],
          ['Platform imagery reverse-searches to unrelated people', 92],
          ['Physical address resolves to a mail drop or another tenant', 84],
          ['Named "regulator" has no government domain', 95]
        ]) +
        '<p class="small dim">Bars show how strongly each signal has correlated with fraudulent platforms in published ' +
        'reporting and in our own file review — not a probability that any particular platform is fraudulent. ' +
        'One signal alone means little; four together mean stop.</p>',

      findings:
        '<h3>The Check Sequence</h3>' +
        table('Run in this order', ['Step', 'Action', 'Result that should stop you', 'Confidence'], [
          ['1', 'Search the exact firm name on Investor.gov', 'No registration found, but the platform claims to be "SEC registered"', 'Confirmed'],
          ['2', 'Search the individual contacting you on BrokerCheck', 'Named advisor has no record, or a record with a different firm', 'Confirmed'],
          ['3', 'Search the name and every variant on the PAUSE list', 'Any category match — including impersonation of a firm they claim to be', 'Confirmed'],
          ['4', 'Search the RED List and NFA BASIC', 'Offering forex, futures or "commodity pools" with no registration', 'Confirmed'],
          ['5', 'Verify any regulator they cite has a real government domain', 'Regulator exists only on the platform\'s own site', 'Confirmed'],
          ['6', 'Check the domain\'s registration date', 'Domain younger than the "twelve-year track record" claimed', 'Confirmed'],
          ['7', 'Reverse-image the team photographs', 'Staff photos belong to unrelated real people', 'Confirmed'],
          ['8', 'Attempt a small withdrawal before adding funds', 'Withdrawal blocked pending a fee, tax, or "verification deposit"', 'Decisive']
        ]) +
        '<h3>Step 8 Deserves Its Own Paragraph</h3>' +
        '<p>The fee-on-withdrawal demand is the single most reliable indicator in this entire file, and it is the one ' +
        'that needs no expertise to spot. <strong>No legitimate platform requires a payment to release your own ' +
        'money.</strong> Not a tax, not a compliance fee, not an anti-money-laundering deposit, not a "liquidity ' +
        'bond". Every one of those is the same demand wearing a different word, and paying it never ends the ' +
        'sequence — it starts the next one.</p>' +
        '<h3>Where The Record Falls Silent</h3>' +
        timeline([
          ['Limit 1', '<strong>Offshore entities.</strong> A platform registered in a jurisdiction with no public company registry cannot be verified or disproven from open sources. Unverifiable is not the same as fraudulent — but it does mean you are relying entirely on their word.'],
          ['Limit 2', '<strong>Recycled legitimate identities.</strong> A fraudulent operation using a real registered firm\'s licence number will pass steps 1 and 2. Defeat this by contacting the real firm through a number you looked up independently, never a number the platform gave you.'],
          ['Limit 3', '<strong>Timing.</strong> Registries update on their own schedule. A platform that cleared these checks last month may be listed today. Re-run before any additional deposit, not just the first.'],
          ['Limit 4', '<strong>Social proof is worthless here.</strong> Reviews, testimonials, screenshots of profits and group-chat enthusiasm are trivially manufactured, and in organised operations they usually are. Weight them at zero.']
        ]),

      conclusion:
        '<h3>Decision Matrix</h3>' +
        table('What your results mean', ['Result', 'Reading', 'What to do'], [
          ['Registered, clean record, verified independently',
           '<span style="color:var(--cyan)">PROCEED WITH NORMAL CAUTION</span>',
           'Registration is not endorsement. Ordinary investment risk still applies in full.'],
          ['Registered, but disclosed complaints or disciplinary events',
           '<span style="color:var(--bronze)">READ THE DISCLOSURES FIRST</span>',
           'BrokerCheck publishes the detail. Read it yourself rather than accepting an explanation.'],
          ['No registration found, no claim of registration made',
           '<span style="color:var(--bronze)">UNREGULATED — UNDERSTAND WHAT THAT MEANS</span>',
           'You carry the entire risk with no regulatory recourse. Sometimes lawful; never protected.'],
          ['No registration found, but registration is claimed',
           '<span style="color:#E88B87">STOP</span>',
           'A false registration claim is not a paperwork error. Do not send funds. Report it.'],
          ['Listed on PAUSE or RED',
           '<span style="color:#E88B87">STOP</span>',
           'A regulator has already published a warning. Do not send funds. Report it.'],
          ['Withdrawal blocked pending any payment',
           '<span style="color:#E88B87">STOP — PAY NOTHING FURTHER</span>',
           'Preserve everything and report immediately. Further payment never releases the funds.']
        ]) +
        '<h3>If You Have Already Sent Money</h3>' +
        '<ul>' +
        '<li><strong>Stop paying immediately.</strong> Every additional fee demand is the same operation, not a final hurdle.</li>' +
        '<li><strong>Preserve everything now</strong> — transaction IDs, wallet addresses, chat logs, screenshots of the platform while it is still reachable. Sites go dark without warning and the evidence goes with them.</li>' +
        '<li><strong>Report to the FBI IC3</strong> (<a href="https://www.ic3.gov/" target="_blank" rel="noopener">ic3.gov</a>) and to your local police. Speed matters far more than a complete report.</li>' +
        '<li><strong>Tell your bank or exchange in writing</strong> and ask them to act on the receiving account.</li>' +
        '<li><strong>Refuse every unsolicited recovery offer.</strong> Victim lists are resold, and the follow-on "recovery" approach is close to guaranteed. Legitimate help never arrives by cold contact demanding a fee up front.</li>' +
        '</ul>' +
        '<div class="notice notice--cyan mt-2"><span class="notice__title">Sources</span>' +
        '<p class="mb-0 small">Built entirely from official public sources: ' +
        '<a href="https://www.investor.gov/" target="_blank" rel="noopener">Investor.gov</a> (SEC) · ' +
        '<a href="https://brokercheck.finra.org/" target="_blank" rel="noopener">FINRA BrokerCheck</a> · ' +
        '<a href="https://www.sec.gov/enforcement-litigation/public-alerts-unregistered-soliciting-entities" target="_blank" rel="noopener">SEC PAUSE</a> · ' +
        '<a href="https://www.cftc.gov/LearnAndProtect/Resources/Check/redlist.htm" target="_blank" rel="noopener">CFTC RED List</a> · ' +
        '<a href="https://www.nfa.futures.org/BasicNet/" target="_blank" rel="noopener">NFA BASIC</a> · ' +
        '<a href="https://www.sec.gov/edgar/search/" target="_blank" rel="noopener">SEC EDGAR</a> · ' +
        '<a href="https://www.ic3.gov/" target="_blank" rel="noopener">FBI IC3</a>. ' +
        'Regulator caveats are quoted verbatim from the agencies\' own pages. This file is general information, ' +
        'not legal or investment advice, and does not create a client relationship.</p></div>'
    },

    /* ------------------------------------------------------------------ */
    {
      id: '6204',
      title: 'Historical Family Tracing &amp; Reunification',
      client: 'Private individual · Tier 01 deep archival · $595',
      opened: '2025-11-04',
      closed: '2025-11-27',
      stamp: 'THREAT LEVEL: N/A — SENSITIVE',
      stampClass: 'stamp--amber',
      analyst: 'LEAD ANALYST',

      summary:
        metrics([
          ['Case Class', 'REUNIFICATION'],
          ['Analyst Hours', '9'],
          ['Records Reviewed', '74', true],
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
          ['Historical city directories', '14', '1978–1996', 'Confirmed'],
          ['Newspaper &amp; obituary archive', '9', '1981–2019', 'Corroborated'],
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
          ['1984 → 1991', 'Subject household traced continuously through six city directory editions at ' + R + '.'],
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
             '<span class="case-btn__id">' + (/^OF/.test(c.id) ? 'OPEN FILE · REAL' : 'CASE #' + c.id) + '</span>' +
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

    els.title.innerHTML = (/^OF/.test(c.id) ? 'Open File — ' : 'Case #' + c.id + ' — ') + c.title;
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
      ' · ' + (/^OF/.test(CASES[state.caseIndex].id) ? 'Open File' : 'Case #' + CASES[state.caseIndex].id);
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