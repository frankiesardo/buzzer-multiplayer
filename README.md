# A Multiplayer Buzzer App

> Run your online quiz game with friends. Zoom conference not included. Questions not included.
>
> Fork as you like.

## The app

[https://buzzer-multiplayer-3e3fa.web.app](https://buzzer-multiplayer-3e3fa.web.app)

We're using Firebase Anonymous Authentication here: meaning that you cannot have multiple players all on the same
browser (open a new tab in incognito if you want to test it).

The upside is that if you want to do teams you can all choose the same name and the app will allow it.

## Local development

Run a local development server with React Fast Refresh: `yarn start`. This also starts a local firebase hosting so you can use the special [reserved urls](https://firebase.google.com/docs/web/setup#from-hosting-urls)

## Deploy it

Run `yarn build` and then push it to Firebase Hosting using `yarn deploy`

## Security Rules

If you want to run your own fork there's no need to override api keys: when you deploy to firebase hosting it will pull your own credentials using firebase reserved urls.

What's inside `firestore.rules` is a good starting point, you probably want to add your own rate limiter rules.
