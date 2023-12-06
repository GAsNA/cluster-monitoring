# Cluster Monitoring
Little web application to monitoring 42Paris clusters.

Frontend is in React ; Backend is in Go.

## TODO
- HOW TO GET RIDE OF THE '../../..' etc LINKS IN FILES?
- When cookie and jwt expires..
- Admin side (staff)
    - page for mac adress and serie num from pc
        - autocompletion merge? (2 fucntions in two files for now)
        - search bar for post
        - verif mac and serial in table
    - set post to unavailable/do not use
    - get cluster with ticket to filter nb ticket in this cluster
    - possibility to archieved ticket types and clusters ??
    - possibility to reoganise order of cluster and ticket type ?
    - multi selection for ticket and post
- Anonymisation button
- Ticket linked to post NOT SEAT ?? (because ethernet for example)
- Pagination on back for ticket (at least) - so pagination in filters page is made in back too
- Change the color of the seats depending on the number of tickets "in progress"
    - get tickets in dasboard by cluster
- In form ticket, if keyboard is choose, select keys on virtual keyboard
- Swagger
- Responsive ticket
- Button "add ..." on admin page will be in separated component

### Questions
- see for authorization header when option, options route, how manage ?
- localstorage for user is good idea ?

## Author
[![rleseur's 42 stats](https://badge42.vercel.app/api/v2/cl7s08vet00110gmnrmm2benl/stats?cursusId=21&coalitionId=45)](https://github.com/JaeSeoKim/badge42)

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/GAsNA">
        <img src="https://avatars.githubusercontent.com/u/58465901?v=4" width="100px;" alt=""/>
      <br />
      <sub>
          <b>@GAsNa (rleseur)</b>
        <br />
      </sub>
      </a>
      <sub>
        <a href="https://profile.intra.42.fr/users/rleseur" title="Intra 42"><img src="https://img.shields.io/badge/Paris-FFFFFF?style=plastic&logo=42&logoColor=000000" alt="Intra 42"/></a>
      </sub>
    </td>
  </tr>
</table>

## Badges
![React badge](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router badge](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![goBadge](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Postgresql badge](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
