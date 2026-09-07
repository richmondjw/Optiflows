# October campaign direction-pack verification

**Status:** PASS

## Passed checks

- Fresh browser session presents the OptiFlows password gate
- Review page returns HTTP 200 after local authentication state is set
- Campaign index links to the October review page
- Campaign index reports three active review campaigns
- Review page declares `noindex,nofollow,noarchive,nosnippet,noimageindex`
- Four editorial chapters are present
- Four actual-photography direction studies are present
- All referenced images reopen and render
- Nine proposed calendar entries are present
- Week filters isolate the selected editorial chapter and social study
- Channel filters isolate the matching calendar entries
- Email filter returns three planned entries
- Desktop and mobile website-activation views switch correctly
- Device controls report the correct accessibility state
- Research brief, calendar CSV and provenance JSON reopen
- Creative provenance records four photographs, creators, licences and original sources
- Desktop horizontal overflow is zero at 1440 pixels
- Mobile horizontal overflow is zero at 390 pixels
- No operational publish, send, schedule or approval control is exposed

## Boundary

This verifies the local release candidate and its review artefacts. It does not verify editorial acceptance, event availability, final photography, rights for future commissioned material, campaign release, email delivery, social publication or production analytics. The OptiFlows publication is a private review surface only.
