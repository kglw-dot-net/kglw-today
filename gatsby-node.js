const rootUrl = 'https://kglw.songfishapp.com';

exports.createPages = async ({actions: {createPage}, graphql}) => {

  for (let day = new Date(2000,0,1); day.getYear() < 101; day.setDate(day.getDate()+1)) {
    // iterating through the year 2000 because it has a leap day
    const monthDay = day.toLocaleDateString('en', {numberingSystem:'latn',month:'short',day:'numeric'});
    createPage({
      path: `/${monthDay.toLowerCase().replace(' ', '-')}`,
      component: require.resolve('./src/templates/month-day.js'),
      context: {
        month: day.getMonth() + 1, // Note: adding 1 here so that Jan=1 Dec=12 to match the data
        day: day.getDate(),
      },
    });
  }

  // redirect `/YYYY-MM-DD` to Songfish
  (await graphql(`
    query ShowUrlsQuery {
      allShowsJson {
        nodes {
          showdate
          permalink
        }
      }
    }
  `)).data.allShowsJson.nodes.forEach(({showdate, permalink}) => {
    const [yyyy,mm,dd] = showdate.split('-');
    createPage({
      path: `/${yyyy}-${mm}-${dd}`,
      component: require.resolve('./src/templates/redirect.js'),
      context: {
        redirectTo: `${rootUrl}/setlists/${permalink}?src=kglw.today&amp;campaign=redirect-date-${yyyy}${mm}${dd}`,
      },
    });
  });
};
