exports.createPages = async ({actions: {createPage}, graphql}) => {

  // for every day in the (leap) year, create a page
  for (let date = new Date(2000,0,1); date.getYear() < 101; date.setDate(date.getDate()+1)) { // iterating through the year 2000 because it has a leap day
    const monthDay = date.toLocaleString('en', {numberingSystem:'latn',month:'short',day:'numeric'})
    createPage({
      path: `/${monthDay.toLowerCase().replace(' ', '-')}`,
      component: require.resolve('./src/templates/month-day.js'),
      context: {
        month: date.getMonth() + 1, // Note: adding 1 here so that Jan=1 Dec=12 to match the data
        day: date.getDate(),
      },
    });
  }

  const RedirectComponent = require.resolve('./src/templates/redirect.js');

  // for every concert date, redirect `/YYYY-MM-DD` to Songfish
  (await graphql(`
    query ShowUrlsQuery {
      allShowsJson {
        nodes {
          showdate
          showorder
          permalink
        }
      }
    }
  `)).data.allShowsJson.nodes.forEach(({
    showdate,
    showorder,
    permalink
  }) => {
    const [yyyy,mm,dd] = showdate.split('-');
    const url = `${yyyy}-${mm}-${dd}`;
    createPage({
      path: `/${url}`,
      component: RedirectComponent,
      context: {
        redirectTo: `https://kglw.net/setlists/${permalink}?src=kglw.today&campaign=${url}`,
      },
    });
    const urlWithShoworder = `${url}@${showorder}`;
    createPage({
      path: `/${urlWithShoworder}`,
      component: RedirectComponent,
      context: {
        redirectTo: `https://kglw.net/setlists/${permalink}?src=kglw.today&campaign=${urlWithShoworder}`,
      },
    });
  });
};
