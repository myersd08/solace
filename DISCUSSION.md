Reviewers:
I am not sure this is helpful, but I thought I would annotate this code test "as I go" to give you an idea of my approach and thoughts I have along the way.  I am limiting this to 2 hours so this will also serve as a way of recording what I would like to do (even if I am not able to get to it).

Initial:
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

Known Issues:
- The search-term input's value is not being cleared when the reset search button is pushed.