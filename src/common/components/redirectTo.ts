import Router from 'next/router';

export default function redirectTo(destination:string, { res, status }:{res: any, status: number} = {res:undefined, status: 302}) {
  if (res) {
    res.writeHead(status || 302, { Location: destination })
    res.end()
  } else {
    if (destination[0] === '/' && destination[1] !== '/') {
      Router.push(destination)
    } else {
      window.location.href = destination
    }
  }
}