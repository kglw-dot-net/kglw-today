(async () =>
  console.log(
    (await (await fetch("https://kglw.songfishapp.com/api/v1/setlists.json?order_by=showdate")).json())
    .data
    .find( show => show.showdate == "2022-10-02" )
    ?.permalink
  )
)()
