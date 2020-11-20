let arc = require('@architect/functions')

exports.handler = async function http (req) {

  // read the count
  let { count } = await arc.http.session.read(req)
  if (!count)
    count = 0

  // if posting incr it
  if (req.requestContext.http.method === 'POST') {
    count += 1
    let cookie = await arc.http.session.write({ count })
    return {
      statusCode: 303,
      headers: { 
        'location': '/',
        'set-cookie': cookie
      }
    }
  }

  // otherwise display it
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: `
      <form action=/count method=post>
        <button>count: ${ count }</button>
      </form>
    `
  }
}
