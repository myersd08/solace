Reviewers:
I am not sure this is helpful, but I thought I would annotate this code test "as I go" to give you an idea of my approach and thoughts I have along the way.  I am limiting this to 2 hours so this will also serve as a way of recording what I would like to do (even if I am not able to get to it).

Initial Approach:
- Get the database running and run the app as is.
- Fix obvious errors such as html errors and not having a key on the list of advocates.  It also looks like it needs some types.
- Go through the app to see if it functions as expected (even if less than optimally)
- Add some features that initially stood out to me:
    - Given the size of the data can be big, the "select" should page the data.
    - The search should be run server side (again, because of the size of data) and be paged.
- UI
    - Normally I would just use what already exists in the app, but I would like to add PrimeReact because 
        a: Solid component library with a consistent style
        b: Given Solace deals in health, you get accessability "for free", which I assume is important.

Points to Notice:
- I moved the search to the server side because of the mentioned size of the data getting large.
- One performance feature that I put in place was having the database searches ask for 1 extra record than the limit so that we can save an extra db query.  This allows to know if there are more records after the set.
- I chose to use an interface for handling all the paging/searching config on the UI side.  

Going Forward:
- The "search" and "list" could/should be broken into separate components
- There should be a UI utilities folder for things like formatting phone numbers
- Pagination could be changed to return total records for possibly a better user experience paging data
- The UI doesn't flow, so adding all the flex classes would be really benefitial
- The search needs to be debounced
- I need to figure out how to include numbers in the search terms (possibly change phone number to a string in schema)

Known Issues:
- The search-term input's value is not being cleared when the reset search button is pushed.

Disclosure:
- I haven't used drizzle (mostly prisma) for an orm, so I used documentation and ai to help with this portion of the test
- I wanted to spend more time on the UI (and also keep this to ~2 hours), but consider the features that I did add as part of the UX.  Hopefully that was the right decision :)