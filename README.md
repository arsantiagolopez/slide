<div align="center">
    <img src="https://i.ibb.co/bgbJxw9/word.png" />
    <a href="https://slide.golf" style="color: #303030;"><h1>Slide</h1></a>
    <h4>Fast, simple, secure messaging between users. Start a conversation with any user in the platform. Add them as friends, and get notified on incoming messages.</h4>
</div>

<div align="center">
    <img src="https://img.shields.io/github/last-commit/arsantiagolopez/slide?label=updated"/>
    <a href="https://github.com/arsantiagolopez/slide/blob/main/LICENSE"><img src="https://img.shields.io/github/license/arsantiagolopez/slide?color=303030" /></a>
    <img src="https://img.shields.io/github/languages/top/arsantiagolopez/slide" />
</div>

<div align="center">
	<a href="https://alexandersantiago.com/"><img src="https://alexandersantiago.com/alex.png" width="24" style="margin-left: -1em;" /></a>
	<a href="https://instagram.com/asantilopez"><img src="https://cdn2.iconfinder.com/data/icons/black-white-social-media/32/instagram_online_social_media_photo-1024.png" width="25" /></a>
	<a href="https://twitter.com/arsantiagolopez"><img src="https://cdn2.iconfinder.com/data/icons/black-white-social-media/32/twitter_online_social_media-512.png" width="25" /></a>
	<a href="mailto:arsantiagolopez@gmail.com"><img src="https://cdn4.iconfinder.com/data/icons/black-white-social-media/32/mail_email_envelope_send_message-1024.png" width="25" /></a>
</div>

<div align="center">
  <a href="#preview">Preview</a> •
  <a href="#features">Features</a> •
  <a href="#tech">Tech Stack</a> •
  <a href="#inspiration">Inspiration</a> •
  <a href="#objectives">Learning</a> •
  <a href="#license">License</a> •
  <a href="#contact">Contact</a>
</div>

<h2 id="preview">⚡ Preview</h2>

<details open>
  <summary>Mobile</summary>
</details>

<details>
  <summary>Desktop</summary>
</details>

<h2 id="features">🎯 Features</h2>

- Start a conversation with any user in the platform.
- Local email authentication via email & password.
- Update your profile name and picture.
- Image uploads to S3 buckets.
- Friend/unfriend other users.
- Receive live notifications on incoming messages.
- Sort conversations by date, name or unread.
- Sort friends by date or name.
- Interactive inbox like UI.

<h2 id="tech">‎‍💻 Tech Stack</h2>

### Client

<table>
  <tr>
      <th>Tech</th>
      <th>What for</th>
  </tr>
  <tr>
      <td><a href="https://reactjs.org/">React</a></td>
      <td>To build a component based user interface.</td>
  </tr>
  <tr>
      <td><a href="https://nextjs.org/">Next.js</a></td>
      <td>Server side rendering (SSR) of React components.</td>
  </tr>
  <tr>
      <td><a href="https://formidable.com/open-source/urql/">URQL</a></td>
      <td>GraphQL Client for data fetching, caching.</td>
  </tr>
    <tr>
      <td><a href="https://graphql.org/">GraphQL</a></td>
      <td>Query language to describe how to interact with the API.</td>
    </tr>
    <tr>
      <td><a href="https://www.apollographql.com/docs/apollo-server/data/subscriptions/">Websockets</a></td>
      <td>GraphQL live subscriptions for real time messaging.</td>
  </tr>
    <tr>
      <td><a href="https://react-hook-form.com/">React Hook Form</a></td>
      <td>Form state management and validation.</td>
  </tr>
   <tr>
      <td><a href="https://react-dropzone.js.org/">React Dropzone</a></td>
      <td>Upload image files.</td>
  </tr>
    <tr>
      <td><a href="https://dndkit.com/">Dnd Kit</a></td>
      <td>Drag & Drop tookit.</td>
  </tr>
    </tr>
  <tr>
      <td><a href="https://momentjs.com/">Moment.js</a></td>
      <td>Parse & display dates.</td>
  </tr>
  <tr>
    <td><a href="https://chakra-ui.com/">Chakra UI</td>
    <td>Quickly build beautiful UI components.</td>
  </tr>
</table>

### Server

<table>
    <tr>
        <th>Tech</th>
        <th>What for</th>
    </tr>
    <tr>
        <td><a href="https://nodejs.org/">Node.js</a></td>
        <td>JavaScript runtime environment.</td>
    </tr>
    <tr>
        <td><a href="https://www.express.com/">Express</a></td>
        <td>Design & build the API.</td>
    </tr>
    <tr>
      <td><a href="https://graphql.org/">GraphQL</a></td>
      <td>Design & model the application entities.</td>
    </tr>
    <tr>
        <td><a href="https://www.postgresql.org/">PostgreSQL</a></td>
        <td>SQL database.</td>
    </tr>
    <tr>
        <td><a href="https://redis.io/">Redis</a></td>
        <td>Store session data in memory for lighting fast queries.</td>
    </tr>
    <tr>
        <td><a href="https://sequelize.org/">Sequelize</a></td>
        <td>Interact with the database.</td>
    </tr>
    <tr>
      <td><a href="https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express">Apollo Server Express</a></td>
      <td>Create a GraphQL server with Express.js.</td>
    </tr>
    <tr>
      <td><a href="https://github.com/sindresorhus/got">GOT</a></td>
      <td>Fetch data with promise based HTTP requests.</td>
    </tr>
    <tr>
        <td>GraphQL API</td>
        <td>HTTP API architecture.</td>
    </tr>
</table>

### DevOps

<table>
    <tr>
        <th>Tech</th>
        <th>What for</th>
    </tr>
    <tr>
        <td><a href="https://vercel.com/">Vercel</a></td>
        <td>Host the client.</td>
    </tr>
    <tr>
        <td><a href="https://www.heroku.com/">Heroku</a></td>
        <td>Server hosting & SSL certificate.</td>
    </tr>
    <tr>
        <td><a href="https://babeljs.io/">Babel</a></td>
        <td>Compile newer versions of JS to vanilla JS.</td>
    </tr>
</table>

<h2 id="inspiration">💡 Inspiration</h2>

Practice project to master GraphQL, subscriptions and improve on skills learned during "Auth" development.

<h2 id="objectives">🚀 Learning Objectives</h2>

- GraphQL mutations.
- Master GraphQL.
- Integrate a minimal modern convetional UI.
- Advanced data caching with URQL.

<h2 id="license">📜 License</h2>

[![License](https://img.shields.io/github/license/arsantiagolopez/slide?color=303030)](./LICENSE)

<h2 id="contact">☕ Contact me</h2>

<div align="left">
	<a href="https://alexandersantiago.com/"><img src="https://alexandersantiago.com/alex.png" width="40" /></a>
	<a href="https://instagram.com/asantilopez"><img src="https://cdn2.iconfinder.com/data/icons/black-white-social-media/32/instagram_online_social_media_photo-1024.png" width="40" /></a>
	<a href="https://twitter.com/arsantiagolopez"><img src="https://cdn2.iconfinder.com/data/icons/black-white-social-media/32/twitter_online_social_media-512.png" width="40" /></a>
	<a href="mailto:arsantiagolopez@gmail.com"><img src="https://cdn4.iconfinder.com/data/icons/black-white-social-media/32/mail_email_envelope_send_message-1024.png" width="40" /></a>
</div>
