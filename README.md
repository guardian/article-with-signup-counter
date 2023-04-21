# article with sign up counter

A set of scripts for building data files describing then number of article promoting newsletters. They work by generating a series of CAPI queries and running them in series. 

The queries are bottle-necked to avoid exceeding the CAPI rate limited for a developer account. Run time for 1 month of data is aprox 2-3 minutes.


## Getting the figure for the number of articles with sign-up tags published during a period
 - Edit the constants in "src/countNewSignUpTagsBySection.ts" to set the desired date range and the file name of the output file (JSON_FILENAME).
 - `npm run count-new`
 - Wait for the script to finish

## Getting the figure for the number of articles published during a period which contain old-embeds

Note that the expected number for recent month is ~0 - the old embeds are only used in sign-up pages. The search is based on checking for strings within the article body and is not 100% reliable.

 - Edit the constants in "src/countOldEmbedBySection.ts" to set the desired date range and the file name of the output file (JSON_FILENAME).
 - `npm run count-old`
 - Wait for the script to finish

## updating the list of newsletters to search for
The file "data/identityNames.json" is used in the scripts to determine which newsletters to search for. For new newsletters, the identity name would need to be added.